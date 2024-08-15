<!--
  功能：个人中心弹窗
  作者：bianxiaokai
  时间：2024年07月24日 14:04:26
-->
<template>
    <van-dialog
        v-model:show="visible"
        teleport="body"
        :show-confirm-button="false"
        :close-on-click-overlay="true"
    >
        <div class="report-container">
            <div class="user-info-card">
                <div class="user-info-tip-content align-center justify-between">
                    <div class="user-info-tip">
                        <div>同学，恭喜您，您已经认识<br />{{ userInfo.learn_num }}个汉字了</div>
                        <div>
                            超过了<span>{{ userInfo.exceed_num }}</span> 的同伴
                        </div>
                    </div>
                    <div class="user-info-tip-icon">
                        <img src="@/assets/images/icon-user-tip.png" alt="" />
                    </div>
                </div>
            </div>
            <div class="user-game-card">
                <div class="user-game-title">这是您在各游戏模式的最高卡数：</div>
                <div class="game-list-box">
                    <van-grid :border="false" :column-num="3" :gutter="0">
                        <van-grid-item v-for="item in userInfo.game_list" :key="item.id">
                            <div
                                class="game-card-box"
                                :style="{ backgroundImage: `url(${item.image})` }"
                            >
                                <div class="game-name">{{ item.name }}</div>
                                <div class="game-process">{{ item.highest }}</div>
                            </div>
                        </van-grid-item>
                    </van-grid>
                </div>
                <div class="game-desc-item">
                    您玩的最好玩的游戏是：<span>{{ userInfo.best_game }}</span>
                </div>
                <div class="game-desc-item">
                    成功闯到了：<span>{{ userInfo.best_level }}</span>
                </div>
                <div class="game-desc-item">
                    最快通过的关卡是：<span>{{ userInfo.fastest_leven }}</span>
                </div>
            </div>
        </div>
    </van-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAppStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
defineProps({});
/**
 * 仓库
 */
const store = useAppStore();

const userInfo = computed(() => {
    return store.state.user;
});

/**
 * 路由对象
 */
const route = useRoute();
/**
 * 路由实例
 */
const router = useRouter();

const visible = ref(false);
const init = () => {
    visible.value = true;
};

defineExpose({ init });
</script>
<style scoped lang="scss">
.report-container {
    width: 100%;
    .user-info-card {
        padding: 16px 20px;
        background: #fcfbf5;
        box-shadow: inset -1px -1px 0px 0px #edc495;
        border-radius: 20px;
        margin-bottom: 12px;
        .user-info-content {
            font-weight: 600;
            font-size: 18px;
            color: #7a3d0f;
            letter-spacing: 2px;
            margin-bottom: 12px;
        }
        .user-info-tip-content {
            .user-info-tip {
                font-size: 13px;
                color: #7a3d0f;
                span {
                    color: #0057ad !important;
                }
            }
            .user-info-tip-icon {
                width: 65px;
                height: 62px;
                img {
                    width: 100%;
                }
            }
        }
    }
    .user-game-card {
        width: 100%;
        // height: 480px;
        background: #fcfbf5;
        border-radius: 20px;
        border: 8px solid #af6400;
        padding: 16px 20px;
        .user-game-title {
            font-weight: 600;
            font-size: 16px;
            color: #7a3d0f;
            margin-bottom: 16px;
        }
        .game-desc-item {
            font-weight: 600;
            font-size: 16px;
            color: #7a3d0f;
            letter-spacing: 2px;
            margin-bottom: 16px;
            span {
                color: #f58310 !important;
            }
        }
    }
}
.game-list-box {
    // height: calc(175px + 72px);
    // overflow-y: auto;
    margin-bottom: 25px;
    .game-card-box {
        width: 72px;
        height: 72px;
        background: url('@/assets/images/game-card-bg.png') no-repeat;
        background-size: 100% 100%;
        position: relative;
        .game-name {
            font-weight: 600;
            font-size: 12px;
            color: #ffffff;
            width: 100%;
            height: 53px;
            text-align: center;
            line-height: 53px;
        }
        .game-process {
            font-weight: 500;
            font-size: 8px;
            color: #ffffff;
            width: 100%;
            height: 17px;
            text-align: center;
            line-height: 17px;
            position: absolute;
            bottom: 0;
            left: 0;
        }
    }
}
</style>
