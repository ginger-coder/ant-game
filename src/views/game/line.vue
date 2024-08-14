<!--
  功能：连连看
  作者：bianxiaokai
  时间：2024年08月05日 15:31:27
-->
<template>
    <div class="game-content">
        <div class="reload" :class="{ disabled: refreshNum <= 0 }" @click="handleRefresh">
            <img src="@/assets/images/refresh.png" width="40" alt="" />
        </div>
        <div class="game-chinese-box" :style="{ width: 40 * board[0].length + 'px' }">
            <div
                v-for="(row, x) in board"
                :key="x"
                class="game-chinese-row"
                :style="{ width: 40 * row.length + 'px' }"
            >
                <div
                    v-for="(cell, y) in row"
                    :key="y"
                    :style="{ left: y * 40 + 'px' }"
                    class="game-chinese-item"
                >
                    <div
                        v-if="cell"
                        class="game-chinese-item-c animate__animated"
                        :class="{
                            active: cell.active,
                            animate__headShake: isErrorId == cell.uid,
                            animate__bounceOut:
                                cell.uid == removeId.first?.uid || cell.uid == removeId.second?.uid
                        }"
                        @click="() => handleChineseItemClick(x, y)"
                    >
                        {{ cell.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import _ from 'lodash';
import { ref, onMounted, computed, getCurrentInstance, watch } from 'vue';
const { proxy } = getCurrentInstance();
import { useAppStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { dynamicChunkArrayWithMaxSize, shuffleMatrix } from '@/utils';
const props = defineProps({
    data: { type: Array, default: () => [] },
    refresh: { type: Number, default: 0 }
});

const emits = defineEmits(['error', 'finish', 'success', 'other']);
/**
 * 仓库
 */
const store = useAppStore();
/**
 * 路由对象
 */
const route = useRoute();
/**
 * 路由实例
 */
const router = useRouter();

const board = ref([]);

const refreshNum = ref(0);

const isErrorId = ref(null);

const removeId = ref({
    first: null,
    second: null
});

watch(
    () => props.refresh,
    value => {
        refreshNum.value = value;
    },
    {
        immediate: true
    }
);

const handleRefresh = () => {
    if (refreshNum.value <= 0) {
        proxy.$showToast('刷新机会已经用完咯~');
        return;
    }
    refreshNum.value = refreshNum.value - 1;
    clearAllActive();
    proxy.$showToast('刷新机会还有' + refreshNum.value + '次哦~');
    board.value = shuffleMatrix(board.value);
};

const other = () => {
    const all = _.cloneDeep(board.value);
    const oArr = all.flat().filter(el => el);
    emits('other', oArr);
};

const renderBoard = data => {
    board.value = dynamicChunkArrayWithMaxSize(data);
    console.log(board.value);
};
watch(
    () => props.data,
    data => {
        const newList = data.map(el => {
            return {
                ...el,
                active: false,
                pear: false
            };
        });
        renderBoard(newList);
    },
    {
        immediate: true
    }
);

const linkCanvas = ref();

const drawLine = path => {
    const canvas = linkCanvas.value;
    const ctx = canvas.getContext('2d');
    if (!path || path.length < 3) return;

    const blockSize = 40; // 假设每个块的尺寸是 50x50 像素
    const offset = blockSize / 2; // 获取中心点偏移量

    ctx.clearRect(0, 0, canvas.width, canvas.height); // 每次绘制前清除之前的线条

    ctx.beginPath();
    ctx.strokeStyle = 'red'; // 设置线条颜色
    ctx.lineWidth = 2; // 设置线条宽度

    for (let i = 0; i < path.length - 1; i++) {
        const startX = path[i].y * blockSize + offset;
        const startY = path[i].x * blockSize + offset;
        const endX = path[i + 1].y * blockSize + offset;
        const endY = path[i + 1].x * blockSize + offset;

        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
    }

    ctx.stroke();
};

let firstClick = null;
let secondClick = null;
// 清空选择
const clearAllActive = () => {
    board.value.forEach(row => {
        row.forEach(cell => {
            if (cell) {
                cell.active = false;
            }
        });
    });
};

const handleChineseItemClick = (x, y) => {
    if (!board.value[x][y]) {
        return;
    } // Ignore if the cell is already empty
    if (!firstClick) {
        clearAllActive();
        firstClick = { x, y };
        board.value[firstClick.x][firstClick.y].active = true;
    } else if (!secondClick) {
        secondClick = { x, y };
        if (
            board.value[firstClick.x][firstClick.y].id ===
                board.value[secondClick.x][secondClick.y].id &&
            board.value[firstClick.x][firstClick.y].uid !==
                board.value[secondClick.x][secondClick.y].uid
        ) {
            const isCanLink = canLink(board.value, firstClick, secondClick);
            if (isCanLink) {
                // active
                board.value[secondClick.x][secondClick.y].active = true;
                // 绘制线路
                // drawLine(pathList);
                emits('success', board.value[firstClick.x][firstClick.y]);

                removeId.value = {
                    first: board.value[firstClick.x][firstClick.y],
                    second: board.value[secondClick.x][secondClick.y]
                };

                // 移除 两个方块
                (function (start_x, start_y, end_x, end_y) {
                    setTimeout(function () {
                        board.value[start_x][start_y] = null;
                        board.value[end_x][end_y] = null;
                        removeId.value = { first: null, second: null };
                        other();
                        // Check if the game is over
                        if (isGameOver(board.value)) {
                            emits('finish');
                            console.log('Game Over');

                            // 结束逻辑
                        }
                    }, 500);
                })(firstClick.x, firstClick.y, secondClick.x, secondClick.y);
            }
        } else {
            isErrorId.value = board.value[secondClick.x][secondClick.y].uid;
            emits('error', board.value[firstClick.x][firstClick.y]);
        }
        firstClick = null;
        secondClick = null;
    }
};

/**
 * 判断连连看游戏中的两个方块是否可以通过不超过两个直线（最多2个拐点）相连
 * @param {Array<Array>} board - 游戏板的二维数组
 * @param {Object} start - 起始方块的位置 {x, y}
 * @param {Object} end - 目标方块的位置 {x, y}
 * @return {boolean} - 是否可以匹配
 */
function canLink(board, start, end) {
    const rows = board.length;
    const cols = board[0].length;

    if (board[start.x][start.y] === null || board[end.x][end.y] === null) {
        return null;
    }

    const directions = [
        { dx: -1, dy: 0 }, // 上
        { dx: 1, dy: 0 }, // 下
        { dx: 0, dy: -1 }, // 左
        { dx: 0, dy: 1 } // 右
    ];

    const queue = [[start, -1, 0, []]]; // [当前位置, 上一次移动的方向, 转弯次数, 路径点数组]
    const visited = Array(rows)
        .fill()
        .map(() => Array(cols).fill(false));
    visited[start.x][start.y] = true;

    while (queue.length > 0) {
        const [current, lastDirection, turns, path] = queue.shift();
        const newPath = [...path, current];

        if (turns > 3) continue; // 超过两次拐弯的路径不考虑
        if (current.x === end.x && current.y === end.y) {
            return newPath; // 找到路径，返回路径数组
        }

        for (let i = 0; i < directions.length; i++) {
            const newX = current.x + directions[i].dx;
            const newY = current.y + directions[i].dy;

            if (
                newX >= 0 &&
                newY >= 0 &&
                newX < rows &&
                newY < cols &&
                (board[newX][newY] === null || (newX === end.x && newY === end.y)) &&
                !visited[newX][newY]
            ) {
                visited[newX][newY] = true;
                queue.push([
                    { x: newX, y: newY },
                    i,
                    i === lastDirection ? turns : turns + 1,
                    newPath
                ]);
            }
        }
    }
    return canConnectOnSameBoundary(board, start, end);
}

function canConnectOnSameBoundary(board, start, end) {
    const rows = board.length;
    const cols = board[0].length;

    // 如果在同一行（上边界或下边界）
    if (start.x === end.x) {
        if (start.x === 0 || start.x === rows - 1) {
            // 上边界或下边界
            if (
                noObstaclesInRow(board, start.x, Math.min(start.y, end.y), Math.max(start.y, end.y))
            ) {
                return createBoundaryPath(start, end, 'horizontal');
            } else if (noObstaclesAboveOrBelow(board, start.x, start.y, end.y)) {
                return createExtendedBoundaryPath(board, start, end, 'horizontal');
            }
        }
    }
    // 如果在同一列（左边界或右边界）
    else if (start.y === end.y) {
        if (start.y === 0 || start.y === cols - 1) {
            // 左边界或右边界
            if (
                noObstaclesInColumn(
                    board,
                    start.y,
                    Math.min(start.x, end.x),
                    Math.max(start.x, end.x)
                )
            ) {
                return createBoundaryPath(start, end, 'vertical');
            } else if (noObstaclesLeftOrRight(board, start.y, start.x, end.x)) {
                return createExtendedBoundaryPath(board, start, end, 'vertical');
            }
        }
    }

    return null; // 无法连线消除
}

function createBoundaryPath(start, end, direction) {
    const path = [];
    const isHorizontal = direction === 'horizontal';

    if (isHorizontal) {
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);
        for (let y = minY; y <= maxY; y++) {
            path.push({ x: start.x, y: y });
        }
    } else {
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        for (let x = minX; x <= maxX; x++) {
            path.push({ x: x, y: start.y });
        }
    }

    return path;
}

function createExtendedBoundaryPath(board, start, end, direction) {
    const path = [];
    const rows = board.length;
    const cols = board[0].length;
    if (direction === 'horizontal') {
        // 向上或向下绕行
        if (start.x === 0) {
            path.push({ x: -1, y: start.y });
            path.push({ x: -1, y: end.y });
        } else if (start.x === rows - 1) {
            path.push({ x: rows, y: start.y });
            path.push({ x: rows, y: end.y });
        }
    } else {
        // 向左或向右绕行
        if (start.y === 0) {
            path.push({ x: start.x, y: -1 });
            path.push({ x: end.x, y: -1 });
        } else if (start.y === cols - 1) {
            path.push({ x: start.x, y: cols });
            path.push({ x: end.x, y: cols });
        }
    }

    path.push(end);
    return path;
}

function noObstaclesInRow(board, row, startCol, endCol) {
    for (let col = startCol + 1; col < endCol; col++) {
        if (board[row][col] !== null) {
            return false;
        }
    }
    return true;
}

function noObstaclesInColumn(board, col, startRow, endRow) {
    for (let row = startRow + 1; row < endRow; row++) {
        if (board[row][col] !== null) {
            return false;
        }
    }
    return true;
}

function noObstaclesAboveOrBelow(board, row, startCol, endCol) {
    const rows = board.length;
    return (
        (row === 0 && noObstaclesInRow(board, rows - 1, startCol, endCol)) ||
        (row === rows - 1 && noObstaclesInRow(board, 0, startCol, endCol))
    );
}

function noObstaclesLeftOrRight(board, col, startRow, endRow) {
    const cols = board[0].length;
    return (
        (col === 0 && noObstaclesInColumn(board, cols - 1, startRow, endRow)) ||
        (col === cols - 1 && noObstaclesInColumn(board, 0, startRow, endRow))
    );
}
const isGameOver = board => {
    return board.every(row => row.every(cell => cell === null));
};
</script>
<style scoped lang="scss">
//爆炸效果
@keyframes fireworks {
    0% {
        transform: scale(0, 0);
    }
    60% {
        transform: scale(1, 1);
        opacity: 1;
    }
    95% {
        transform: scale(0.9, 0.9);
    }
    100% {
        transform: scale(0.9, 0.9);
        opacity: 0;
    }
}
.disappear {
    animation: fireworks 2s 0.5s linear;
}

.game-content {
    position: relative;
    padding: 10px 0;
    .reload {
        position: absolute;
        right: 10px;
        top: -40px;
        color: #af6400;
        &.disabled {
            filter: grayscale(100%);
        }
    }
}
.game-chinese-box {
    margin: 0 auto;
    position: relative;
    .game-chinese-canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 1;
    }
    .game-chinese-row {
        position: relative;
        width: 100%;
        height: 40px;
        z-index: 1;
    }
    .game-chinese-item {
        position: absolute;
        top: 0;
        width: 40px;
        height: 40px;
    }
    .game-chinese-item-c {
        background: url('@/assets/images/select-cha-bg.png') no-repeat;
        width: 40px;
        height: 40px;
        background-size: 100% 100%;
        text-align: center;
        line-height: 40px;
        font-size: 26px;
        color: #571f20;
        &.active {
            background: url('@/assets/images/select-cha-bg-active.png') no-repeat;
            background-size: 100% 100%;
            color: #ffffff;
            -webkit-text-stroke: 1px #082350;
        }
    }
}
</style>
