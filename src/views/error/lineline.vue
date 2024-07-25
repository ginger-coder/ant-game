<!--
  功能：错题本
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
                <div class="level-name align-center">错字联系</div>
            </div>
        </div>
        <div class="game-error-tip">选择您要练习的错字，开始您的闯关之旅吧！</div>
        <div class="game-area-box">
            <van-grid :border="false" :column-num="3" :gutter="0">
                <van-grid-item>
                    <div class="game-card-box align-center">
                        <div class="game-check">11</div>
                        <div class="game-chinese">汉</div>
                    </div>
                </van-grid-item>
            </van-grid>
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

const isWaitGame = ref(false);

const gameWaitRef = ref();
const gameOverDialogRef = ref();
const gamePassDialogRef = ref();

const chineseList = ref([
    {
        id: 1,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com',
        active: false
    },
    {
        id: 2,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com',
        active: true
    }
]);

onMounted(() => {
    //console.log('3.-组件挂载到页面之后执行-------onMounted')
    // gameWaitRef.value && gameWaitRef.value.start();
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
    background: rgb(252, 251, 245, 0.85);
    box-shadow: inset 0px 1px 5px 0px #73c2f7;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 80px;
    .game-info-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .level-name {
            -webkit-text-stroke: 1px #b06400;
            font-size: 14px;
            color: #ffffff;
            line-height: 16px;
            &::before {
                content: '';
                display: block;
                width: 20px;
                height: 20px;
                background: url('@/assets/images/icon-error-tip.png') no-repeat;
                background-size: 100% 100%;
                margin-right: 5px;
            }
        }
    }
}
.game-error-tip {
    width: 300px;
    margin: 0 auto;
    font-weight: 600;
    font-size: 18px;
    color: #ffebaa;
    line-height: 25px;
    -webkit-text-stroke: 1px #7a3d0f;
}
.game-area-box {
    padding-top: 18px;
    .game-card-box {
        width: 104px;
        height: 64px;
        background: #fefbeb;
        box-shadow:
            0px 2px 4px 0px rgba(29, 116, 0, 0.25),
            inset -2px -2px 1px 0px rgba(223, 151, 95, 0.52),
            inset 2px 2px 1px 0px #ffffff;
        border-radius: 16px;
        .game-chinese {
            width: 40px;
            height: 40px;
            box-shadow: 0px 2px 4px 0px rgba(29, 116, 0, 0.25);
            border-radius: 4px;
            border: 1px solid #b06400;
            font-size: 32px;
            color: #aa660d;
            text-align: center;
            line-height: 40px;
        }
    }
}
</style>
