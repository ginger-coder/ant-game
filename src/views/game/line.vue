<!--
  功能：连连看
  作者：bianxiaokai
  时间：2024年08月05日 15:31:27
-->
<template>
    <div class="game-chinese-box">
        <div
            v-for="(row, y) in board"
            :key="y"
            class="game-chinese-row"
            :style="{ width: 50 * row.length + 'px' }"
        >
            <div
                v-for="(item, x) in row"
                :key="x"
                :style="{ left: x * 50 + 'px' }"
                class="game-chinese-item"
            >
                <div
                    v-if="item"
                    class="game-chinese-item-c"
                    :class="{ active: item.active }"
                    @click="() => handleChineseItemClick(x, y)"
                >
                    {{ item.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
import { useAppStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { dynamicChunkArrayWithMaxSize } from '@/utils';
const props = defineProps({
    data: { type: Array, default: () => [] }
});
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

const dataArr = computed(() => {
    return props.data;
});

const board = ref([]);

const size = 6;

const renderBoard = () => {
    board.value = dynamicChunkArrayWithMaxSize(dataArr.value, size);
};

let firstClick = null;
let secondClick = null;

const handleChineseItemClick = (x, y) => {
    if (!board.value[y][x]) {
        return;
    } // Ignore if the cell is already empty
    if (!firstClick) {
        firstClick = { x, y };
    } else if (!secondClick) {
        secondClick = { x, y };
        if (
            board.value[firstClick.y][firstClick.x].id ===
            board.value[secondClick.y][secondClick.x].id
        ) {
            if (isMatch(board.value, firstClick, secondClick)) {
                board.value[firstClick.y][firstClick.x] = null;
                board.value[secondClick.y][secondClick.x] = null;

                // Check if the game is over
                if (isGameOver(board.value)) {
                    proxy.$showToast('游戏结束~');
                }
            }
        }
        firstClick = null;
        secondClick = null;
    }
};

const isMatch = (board, firstClick, secondClick) => {
    // Simplified: Directly check horizontal and vertical lines
    // TODO: Implement more complex path finding logic
    return canConnectDirectly(board, firstClick, secondClick);
};

const canConnectDirectly = (board, firstClick, secondClick) => {
    if (firstClick.x === secondClick.x) {
        // Check horizontal line
        const [start, end] =
            firstClick.y < secondClick.y
                ? [firstClick.y, secondClick.y]
                : [secondClick.y, firstClick.y];
        for (let i = start + 1; i < end; i++) {
            if (board[i][firstClick.x]) {
                return false;
            }
        }
        return true;
    } else if (firstClick.y === secondClick.y) {
        // Check vertical line
        const [start, end] =
            firstClick.x < secondClick.x
                ? [firstClick.x, secondClick.x]
                : [secondClick.x, firstClick.x];
        for (let i = start + 1; i < end; i++) {
            if (board[firstClick.y][i]) {
                return false;
            }
        }
        return true;
    }
    return false;
};

const isGameOver = board => {
    return board.every(row => row.every(cell => cell === null));
};

onMounted(() => {
    renderBoard();
});
</script>
<style scoped lang="scss">
.game-chinese-box {
    .game-chinese-row {
        position: relative;
        width: 100%;
        height: 50px;
        margin: 0 auto;
    }
    .game-chinese-item {
        position: absolute;
        top: 0;
        width: 50px;
        height: 50px;
        padding: 5px;
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
