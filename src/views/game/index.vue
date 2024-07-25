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
            <!-- <ant-game-wait ref="gameWaitRef" @end="onWaitTimeEnd" /> -->
            <div class="game-content">
                <div class="game-tip-top">
                    <div class="chinese-info">汉</div>
                    <div class="chinese-tip">
                        <div class="chinese-read chinese-font">读音：<span>shui</span></div>
                        <div class="chinese-left chinese-font">部首：<span>三</span></div>
                    </div>
                    <div class="chinese-other">
                        <div class="chinese-audio">
                            <img src="@/assets/images/icon-audio.png" width="16px" alt="" />
                        </div>
                        <div class="chinese-num chinese-font">笔画：<span>3</span></div>
                    </div>
                </div>
                <div class="game-content-desc">选择偏旁和部首组成一个汉字</div>
                <div class="game-chinese-box">
                    <div v-for="item in chineseList" :key="item.id" class="game-chinese-item">
                        <div class="game-chinese-item-c">
                            {{ item.chinese }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <game-over-dialog />
    </div>
</template>

<script setup>
import gameOverDialog from './game-over-dialog.vue';
import gamePassDialog from './game-pass-dialog.vue';
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

const chineseList = ref([
    {
        id: 1,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 2,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 3,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 4,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 5,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 6,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 7,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 8,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 9,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 10,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 11,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 12,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 13,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 14,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 15,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 16,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 17,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 18,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 19,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 20,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 21,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 22,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 23,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 24,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 25,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 26,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 27,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 28,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 29,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
    },
    {
        id: 130,
        chinese: '汉',
        chinese_read: 'shui',
        chinese_num: '3',
        chinese_left: '三',
        chinese_audio: 'https://www.baidu.com'
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

.game-chinese-box {
    padding: 16px 16px 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: 0 auto;
    .game-chinese-item {
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
    }
}

.game-area-box {
    padding-top: 18px;
}
.game-content {
    .game-tip-top {
        width: 243px;
        height: 80px;
        background: url('@/assets/images/icon-tip-bg.png') no-repeat;
        background-size: 100% 100%;
        margin: 0 auto;
        padding: 18px 20px;
        display: flex;
        align-items: center;
        margin-bottom: 32px;
        .chinese-info {
            width: 40px;
            height: 40px;
            background: url('@/assets/images/chinese-bg.png') no-repeat;
            background-size: 100% 100%;
            text-align: center;
            line-height: 40px;
            font-size: 32px;
            color: #aa660d;
            margin-right: 12px;
        }
        .chinese-tip {
            margin-right: 20px;
        }
        .chinese-font {
            font-weight: 400;
            font-size: 13px;
            color: #acacac;
            span {
                color: #aa660d !important;
            }
        }
    }
    .game-content-desc {
        font-weight: 600;
        font-size: 18px;
        color: #ffebaa;
        line-height: 25px;
        text-align: center;
        // -webkit-text-stroke: 2px #7a3d0f;
    }
}
</style>
