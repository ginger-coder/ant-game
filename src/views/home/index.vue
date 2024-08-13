<!--
  功能：首页
  作者：bianxiaokai
  时间：2024年07月23日 17:07:45
-->
<template>
    <div class="container index-bg">
        <div class="con-content">
            <div class="home-title">
                <div class="game-name">
                    <img src="@/assets/images/logo.png" width="116px" alt="" />
                </div>
                <div class="user-top" @click="handleInfo">
                    <div class="user-avager">
                        <img :src="userInfo.avatar" alt="" />
                    </div>
                    <div class="user-info">
                        <div class="user-name">
                            <van-text-ellipsis :content="userInfo.nickname" />
                        </div>
                        <div class="user-data">识字数：56</div>
                    </div>
                </div>
            </div>
            <div class="home-game-box">
                <van-swipe :show-indicators="false" width="375">
                    <van-swipe-item v-for="item in game_list" :key="item.id">
                        <div class="game-item">
                            <div class="game-title">
                                {{ item.name }}
                            </div>
                            <div class="game-icon" @click="handleSelectLevel(item.id)">
                                <img :src="item.image" alt="" />
                            </div>
                        </div>
                    </van-swipe-item>
                </van-swipe>
            </div>
        </div>
        <ant-filter-blur />
        <select-level-dialog ref="levelDialogRef" />
        <personal-center-dialog ref="personalCenterRef" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, getCurrentInstance } from 'vue';
import { useAppStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import selectLevelDialog from './select-level-dialog.vue';
import personalCenterDialog from './personal-center-dialog.vue';
import { getUserInfo } from '@/utils/cache';
import api from '@/api';
const { proxy } = getCurrentInstance();
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

const userInfo = computed(() => {
    return getUserInfo();
});

const game_list = computed(() => {
    return store.state.user.game_list || [];
});

const init = () => {
    store.setUserInfo(userInfo.value.id);
};

/**
 * 数据部分
 */
const levelDialogRef = ref();

const handleSelectLevel = id => {
    if (id !== 1) {
        proxy.$showToast('游戏暂未开放');
        return;
    }
    levelDialogRef.value.init();
};

const personalCenterRef = ref();
const handleInfo = () => {
    personalCenterRef.value.init();
};

onMounted(() => {
    init();
});
</script>
<style scoped lang="scss">
.container {
    position: relative;
    .con-content {
        position: relative;
        z-index: 2;
        width: 100%;
        height: 100%;
    }
    .home-title {
        padding: 0 18px;
        .game-name {
            margin-bottom: 15px;
            padding-top: 10px;
        }
        .user-top {
            width: 126px;
            height: 48px;
            border-radius: 28px;
            border: 2px solid #1c74f9;
            display: flex;
            align-items: center;
            padding: 6px;
            overflow: hidden;
            margin-bottom: 27px;
            .user-avager {
                width: 36px;
                height: 36px;
                border: 2px solid #0091ed;
                border-radius: 50%;
                overflow: hidden;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .user-info {
                padding-left: 5px;
                .user-name {
                    font-size: 13px;
                    color: #ffffff;
                    line-height: 15px;
                    -webkit-text-stroke: 1px #1c74f9;
                    width: 100%;
                }
                .user-data {
                    font-weight: 500;
                    font-size: 10px;
                    color: #002b6b;
                }
            }
        }
    }
    .home-game-box {
        padding-top: 42px;
        .game-item {
            width: 200px;
            margin: 0 auto;
        }
        .game-title {
            width: 100%;
            padding: 12px 0;
            text-align: center;
            color: #fff;
            font-size: 28px;
            -webkit-text-stroke: 1px #694800;
        }
        .game-icon {
            width: 188px;
            height: 188px;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .game-start-box {
        width: 142px;
        height: 56px;
        position: absolute;
        bottom: 72px;
        left: 50%;
        margin-left: -71px;
        img {
            width: 100%;
        }
    }
}
</style>
