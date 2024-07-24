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
                <div class="user-top">
                    <div class="user-avager">
                        <img src="" alt="" />
                    </div>
                    <div class="user-info">
                        <div class="user-name">
                            <van-text-ellipsis content="踩核查" />
                        </div>
                        <div class="user-data">识字数：1000+</div>
                    </div>
                </div>
                <div class="err-book">
                    <img src="@/assets/images/icon-btn-error.png" alt="" />
                </div>
            </div>
            <div class="home-game-box">
                <div class="game-title">
                    <img src="@/assets/images/icon-lineline-title.png" alt="" />
                </div>
                <div class="game-icon" @click="handleSelectLevel">
                    <img src="@/assets/images/icon-lineline.png" alt="" />
                </div>
            </div>
            <!-- <div class="game-start-box">
                <img src="@/assets/images/icon-btn-start.png" alt="" />
            </div> -->
        </div>
        <ant-filter-blur />
        <select-level-dialog ref="levelDialogRef" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAppStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import selectLevelDialog from './select-level-dialog.vue';
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
/**
 * 数据部分
 */
const levelDialogRef = ref();

const handleSelectLevel = () => {
    levelDialogRef.value.init();
};

onMounted(() => {
    //console.log('3.-组件挂载到页面之后执行-------onMounted')
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
        .err-book {
            width: 48px;
            height: 55px;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .home-game-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 42px;
        .game-title {
            width: 93px;
            height: 42px;
            margin-bottom: 33px;
            img {
                width: 100%;
                height: 100%;
            }
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
