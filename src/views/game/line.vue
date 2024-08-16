<!--
  功能：连连看
  作者：bianxiaokai
  时间：2024年08月05日 15:31:27
-->
<template>
    <div class="game-content">
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
        <div class="refresh-btn" :class="{ disabled: refreshNum <= 0 }" @click="handleRefresh">
            <div class="refresh-num">{{ refreshNum }}</div>
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
    refresh: { type: Number, default: 0 },
    row: { type: Number, default: 8 },
    col: { type: Number, default: 8 }
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
    // proxy.$showToast('刷新机会还有' + refreshNum.value + '次哦~');
    board.value = shuffleMatrix(board.value);
};

const other = () => {
    const all = _.cloneDeep(board.value);
    const oArr = all.flat().filter(el => el);
    emits('other', oArr);
};

const renderBoard = data => {
    board.value = dynamicChunkArrayWithMaxSize(data, props.col, props.row);
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
            const isCanLink = findPath(board.value, firstClick, secondClick);
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

function findPath(board, start, end) {
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

        if (turns > 2) continue; // 超过三次拐弯的路径不考虑
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

    return (
        canConnectOnSameBoundary(board, start, end) ||
        canConnectToBoundary(board, start, end) ||
        canWrapAroundBoundary(board, start, end) ||
        null
    );
}

function canConnectToBoundary(board, internal, external) {
    const rows = board.length;
    const cols = board[0].length;

    // 检查上下边界
    if (internal.x === 0 || internal.x === rows - 1) {
        if (
            noObstaclesInRow(
                board,
                internal.x,
                Math.min(internal.y, external.y),
                Math.max(internal.y, external.y)
            )
        ) {
            return createBoundaryPath(internal, external, 'horizontal');
        }
    }
    // 检查左右边界
    if (internal.y === 0 || internal.y === cols - 1) {
        if (
            noObstaclesInColumn(
                board,
                internal.y,
                Math.min(internal.x, external.x),
                Math.max(internal.x, external.x)
            )
        ) {
            return createBoundaryPath(internal, external, 'vertical');
        }
    }

    return null; // 无法连线消除
}

function canWrapAroundBoundary(board, internal, external) {
    const rows = board.length;
    const cols = board[0].length;

    const wrapAroundPaths = [];

    // 上边界绕行
    if (internal.x > 0 && noObstaclesInRow(board, 0, 0, cols - 1)) {
        wrapAroundPaths.push([
            { x: 0, y: internal.y },
            { x: 0, y: external.y }
        ]);
    }
    // 下边界绕行
    if (internal.x < rows - 1 && noObstaclesInRow(board, rows - 1, 0, cols - 1)) {
        wrapAroundPaths.push([
            { x: rows - 1, y: internal.y },
            { x: rows - 1, y: external.y }
        ]);
    }
    // 左边界绕行
    if (internal.y > 0 && noObstaclesInColumn(board, 0, 0, rows - 1)) {
        wrapAroundPaths.push([
            { x: internal.x, y: 0 },
            { x: external.x, y: 0 }
        ]);
    }
    // 右边界绕行
    if (internal.y < cols - 1 && noObstaclesInColumn(board, cols - 1, 0, rows - 1)) {
        wrapAroundPaths.push([
            { x: internal.x, y: cols - 1 },
            { x: external.x, y: cols - 1 }
        ]);
    }

    for (const path of wrapAroundPaths) {
        if (
            noObstaclesInRow(
                board,
                path[0].x,
                Math.min(path[0].y, path[1].y),
                Math.max(path[0].y, path[1].y)
            ) ||
            noObstaclesInColumn(
                board,
                path[0].y,
                Math.min(path[0].x, path[1].x),
                Math.max(path[0].x, path[1].x)
            )
        ) {
            return [
                ...createBoundaryPath(internal, path[0], 'horizontal'),
                ...createBoundaryPath(path[1], external, 'horizontal')
            ];
        }
    }

    return null; // 无法通过边界绕行连接
}

// 修正同一边界连线逻辑
function canConnectOnSameBoundary(board, start, end) {
    const rows = board.length;
    const cols = board[0].length;

    if (start.x === end.x) {
        // 在同一行的情况下
        if (
            (start.x === 0 || start.x === rows - 1) &&
            noObstaclesInRow(board, start.x, Math.min(start.y, end.y), Math.max(start.y, end.y))
        ) {
            return createBoundaryPath(start, end, 'horizontal');
        }
    } else if (start.y === end.y) {
        // 在同一列的情况下
        if (
            (start.y === 0 || start.y === cols - 1) &&
            noObstaclesInColumn(board, start.y, Math.min(start.x, end.x), Math.max(start.x, end.x))
        ) {
            return createBoundaryPath(start, end, 'vertical');
        }
    }

    return null;
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

function noObstaclesInRow(board, row, startCol, endCol) {
    if (row < 0 || row >= board.length) return false;

    for (let col = startCol + 1; col < endCol; col++) {
        if (board[row][col] !== null) {
            return false;
        }
    }
    return true;
}

function noObstaclesInColumn(board, col, startRow, endRow) {
    if (col < 0 || col >= board[0].length) return false;

    for (let row = startRow + 1; row < endRow; row++) {
        if (board[row][col] !== null) {
            return false;
        }
    }
    return true;
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
.disabled {
    filter: grayscale(100%);
}
.game-chinese-box {
    margin: 0 auto;
    position: relative;
    background: linear-gradient(180deg, #4a9719 0%, #2b7700 100%);
    box-shadow:
        0px 1px 0px 0px rgba(185, 231, 51, 0.3),
        inset 0px 1px 2px 0px rgba(0, 0, 0, 0.35);
    border-radius: 12px;
    margin-bottom: 10px;
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

.refresh-btn {
    background: url('@/assets/images/refresh.png') no-repeat;
    background-size: 100% 100%;
    width: 76px;
    height: 80px;
    margin: 0 auto;
    position: relative;
    .refresh-num {
        width: 22px;
        height: 22px;
        background: url('@/assets/images/refresh-num.png') no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: normal;
        font-size: 12px;
        color: #ffffff;
        position: absolute;
        right: 0;
        top: 0;
    }
}
</style>
