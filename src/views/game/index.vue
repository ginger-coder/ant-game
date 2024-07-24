<!--
  功能：游戏开始
  作者：bianxiaokai
  时间：2024年07月24日 15:34:37
-->
<template>
    <div class="container game-bg">
        <div class="game-name">
            <img src="@/assets/images/logo.png" width="116px" alt="" />
        </div>
        <div class="game-info-card">
            <div class="game-info-title">
                <div class="level-name">第一关</div>
                <div class="game-time">剩余时间：<span class="t">无限制</span></div>
            </div>
            <ant-progress-line :percentage="50" style="margin-bottom: 12px" />
            <div class="game-tip">
                <div class="game-tip-item">一年级</div>
                <div class="game-tip-item">简单</div>
                <div class="game-tip-item">剩余数量：<span>22</span></div>
                <div class="game-tip-item">错误数据：<span>13</span></div>
            </div>
        </div>
        <div class="game-area-box">
            <ant-game-wait ref="gameWaitRef" @end="onWaitTimeEnd" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAppStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
defineProps({});
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
//console.log('1-开始创建组件-setup')

const gameWaitRef = ref();

onMounted(() => {
    //console.log('3.-组件挂载到页面之后执行-------onMounted')
    gameWaitRef.value.start();
});

const onWaitTimeEnd = () => {
    console.log('倒计时结束');
};
</script>
<style scoped lang="scss">
.container {
    padding: 10px 16px;
}
.game-name {
    margin-bottom: 17px;
}
.game-info-card {
    width: 100%;
    height: 112px;
    background: rgb(252, 251, 245, 0.85);
    box-shadow: inset 0px 1px 5px 0px #73c2f7;
    border-radius: 12px;
    padding: 16px;
    .game-info-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 11px;
        .level-name {
            -webkit-text-stroke: 1px #b06400;
            font-size: 14px;
            color: #ffffff;
            line-height: 16px;
        }
        .game-time {
            font-weight: 500;
            font-size: 12px;
            color: #af6400;
            .t {
                color: #3191f6 !important;
            }
        }
    }
    .game-tip {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .game-tip-item {
            padding: 0 10px;
            height: 22px;
            background: #aee036;
            border-radius: 11px;
            border: 2px solid #aee036;
            font-weight: 600;
            font-size: 10px;
            color: #277e04;
            text-align: center;
            line-height: 22px;
        }
    }
}
</style>
