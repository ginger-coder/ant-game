<!--
  功能：连连看
  作者：bianxiaokai
  时间：2024年08月05日 15:31:27
-->
<template>
    <div class="game-content">
        <div class="reload" @click="refresh">刷新</div>
        <div class="game-chinese-box">
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
                        class="game-chinese-item-c"
                        :class="{ active: cell.active }"
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
    data: { type: Array, default: () => [] }
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

const refresh = () => {
    board.value = shuffleMatrix(board.value);
};

const other = () => {
    const all = _.cloneDeep(board.value);
    const oArr = all.flat().filter(el => el);
    emits('other', oArr);
};

const renderBoard = data => {
    board.value = dynamicChunkArrayWithMaxSize(data, size);
};
watch(
    () => props.data,
    data => {
        renderBoard(data);
    },
    {
        immediate: true
    }
);

const size = 6;

let firstClick = null;
let secondClick = null;

const handleChineseItemClick = (x, y) => {
    if (!board.value[x][y]) {
        return;
    } // Ignore if the cell is already empty

    if (!firstClick) {
        firstClick = { x, y };
    } else if (!secondClick) {
        secondClick = { x, y };
        if (
            board.value[firstClick.x][firstClick.y].id ===
                board.value[secondClick.x][secondClick.y].id &&
            board.value[firstClick.x][firstClick.y].uid !==
                board.value[secondClick.x][secondClick.y].uid
        ) {
            emits('success', board.value[firstClick.x][firstClick.y]);
            if (canLink(board.value, firstClick, secondClick)) {
                board.value[firstClick.x][firstClick.y] = null;
                board.value[secondClick.x][secondClick.y] = null;
                other();
                // Check if the game is over
                if (isGameOver(board.value)) {
                    emits('finish');
                    // 结束逻辑
                }
            }
        } else {
            if (
                board.value[firstClick.x][firstClick.y].uid !==
                board.value[secondClick.x][secondClick.y].uid
            ) {
                emits('error', board.value[firstClick.x][firstClick.y]);
            }
        }
        firstClick = null;
        secondClick = null;
    }
};

/**
 * 判断连连看游戏中的两个方块是否可以通过不超过两个直线（最多一个拐点）相连
 * @param {Array<Array>} board - 游戏板的二维数组
 * @param {Object} start - 起始方块的位置 {x, y}
 * @param {Object} end - 目标方块的位置 {x, y}
 * @return {boolean} - 是否可以匹配
 */
function canLink(board, start, end) {
    const rows = board.length;
    const cols = board[0].length;

    if (board[start.x][start.y] === null || board[end.x][end.y] === null) {
        return false;
    }

    const directions = [
        { dx: -1, dy: 0 }, // up
        { dx: 1, dy: 0 }, // down
        { dx: 0, dy: -1 }, // left
        { dx: 0, dy: 1 } // right
    ];

    const queue = [[start, -1, 0]]; // [current position, last direction, turn count]
    const visited = Array(rows)
        .fill()
        .map(() => Array(cols).fill(false));
    visited[start.x][start.y] = true;

    while (queue.length > 0) {
        const [current, lastDirection, turns] = queue.shift();

        if (turns > 2) continue; // More than 2 turns are not allowed
        if (current.x === end.x && current.y === end.y) return true;

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
                queue.push([{ x: newX, y: newY }, i, i === lastDirection ? turns : turns + 1]);
            }
        }
    }

    // 检查边界外绕过障碍物的情况
    return checkBoundaryPath(board, start, end);
}

/**
 * 检查从边界绕过障碍物是否可以连通
 * @param {Array<Array>} board - 游戏板的二维数组
 * @param {Object} start - 起始方块的位置 {x, y}
 * @param {Object} end - 目标方块的位置 {x, y}
 * @return {boolean} - 是否可以通过边界外路径匹配
 */
function checkBoundaryPath(board, start, end) {
    const rows = board.length;
    const cols = board[0].length;

    // 检查通过左边界
    if (
        isClearPath(board, { x: start.x, y: 0 }, { x: end.x, y: 0 }) &&
        isClearPath(board, { x: end.x, y: 0 }, end)
    ) {
        return true;
    }

    // 检查通过右边界
    if (
        isClearPath(board, { x: start.x, y: cols - 1 }, { x: end.x, y: cols - 1 }) &&
        isClearPath(board, { x: end.x, y: cols - 1 }, end)
    ) {
        return true;
    }

    // 检查通过上边界
    if (
        isClearPath(board, { x: 0, y: start.y }, { x: 0, y: end.y }) &&
        isClearPath(board, { x: 0, y: end.y }, end)
    ) {
        return true;
    }

    // 检查通过下边界
    if (
        isClearPath(board, { x: rows - 1, y: start.y }, { x: rows - 1, y: end.y }) &&
        isClearPath(board, { x: rows - 1, y: end.y }, end)
    ) {
        return true;
    }

    return false;
}

/**
 * 检查两点之间是否有清晰的路径（不包含障碍物）
 * @param {Array<Array>} board - 游戏板的二维数组
 * @param {Object} start - 起始点的位置 {x, y}
 * @param {Object} end - 目标点的位置 {x, y}
 * @return {boolean} - 是否有清晰的路径
 */
function isClearPath(board, start, end) {
    if (start.x === end.x) {
        for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
            if (board[start.x][y] !== null && !(start.x === end.x && y === end.y)) {
                return false;
            }
        }
    } else if (start.y === end.y) {
        for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
            if (board[x][start.y] !== null && !(x === end.x && start.y === end.y)) {
                return false;
            }
        }
    }
    return true;
}

const isGameOver = board => {
    return board.every(row => row.every(cell => cell === null));
};
</script>
<style scoped lang="scss">
.game-content {
    position: relative;
    padding: 10px 0;
    .reload {
        position: absolute;
        right: 0;
        top: -20px;
        color: #af6400;
    }
}
.game-chinese-box {
    .game-chinese-row {
        position: relative;
        width: 100%;
        height: 40px;
        margin: 0 auto;
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
