<!--
  功能：个人中心弹窗
  作者：bianxiaokai
  时间：2024年07月24日 14:04:26
-->
<template>
    <van-dialog v-model:show="visible" :show-confirm-button="false" :close-on-click-overlay="true">
        <div class="personal-center-box">
            <div class="personal-title justify-between align-center">
                <div class="personal-title-user align-center">
                    <div class="user-avager">
                        <img :src="userInfo.avatar" alt="" />
                    </div>
                    <div class="user-info">
                        <div class="user-name">{{ userInfo.nickname }}</div>
                        <div class="user-id">ID：{{ userInfo.id }}</div>
                    </div>
                </div>
                <div class="game-report align-center" @click="handleReport">识字报告</div>
            </div>
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
            <div class="system-info">
                <div class="media-set-item align-center">
                    <div class="music-set-title">音乐</div>
                    <van-switch
                        v-model="isMusicStop"
                        active-color="#fff"
                        inactive-color="#fff"
                        size="16px"
                        class="audio-switch"
                    />
                    <div class="music-set-move">
                        <van-slider
                            v-model="musicValue"
                            bar-height="14px"
                            active-color="#FDBB27"
                            @change="onMusicChange"
                        />
                    </div>
                </div>
                <div class="media-set-item align-center">
                    <div class="music-set-title">音效</div>
                    <van-switch
                        v-model="isAudioStop"
                        active-color="#fff"
                        inactive-color="#fff"
                        size="16px"
                        class="audio-switch"
                    />
                    <div class="music-set-move">
                        <van-slider
                            v-model="audioValue"
                            bar-height="14px"
                            active-color="#FDBB27"
                            @change="onAudioChange"
                        />
                    </div>
                </div>
                <div class="mobile">客服电话：0350-5624584</div>
            </div>
            <div class="err-book" @click="handleErrBookClick">
                <img src="@/assets/images/icon-btn-error.png" alt="" />
            </div>
        </div>
        <study-report-dialog ref="studyReportRef" />
    </van-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAppStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import studyReportDialog from './study-report-dialog.vue';

defineProps({});

const isMusicStop = ref(true);
const isAudioStop = ref(false);

const visible = ref(false);
const musicValue = ref(50);
const studyReportRef = ref();
const onMusicChange = value => {
    console.log(value);
};
const audioValue = ref(50);
const onAudioChange = value => {
    console.log(value);
};

const handleReport = () => {
    studyReportRef.value.init();
};
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

const handleErrBookClick = () => {
    router.push({
        name: 'error'
    });
};

const init = () => {
    visible.value = true;
};

defineExpose({ init });
</script>
<style scoped lang="scss">
:deep(.van-slider__bar) {
    box-shadow: inset -2px -2px 0px 0px #f58310;
}
.err-book {
    width: 48px;
    height: 53px;
    margin: 0 auto;
    img {
        width: 100%;
        height: 100%;
    }
}
.personal-center-box {
    padding: 20px;
    width: 100%;
    background: #fdbc74;
    border-radius: 20px;
    border: 8px solid #af6400;
    padding: 16px 20px;
    .system-info {
        .media-set-item {
            width: 100%;
            height: 51px;
            background: rgb(196, 93, 8, 0.35);
            box-shadow: inset 0px 1px 3px 0px rgba(189, 88, 29, 0.95);
            border-radius: 8px;
            margin-bottom: 12px;
            padding: 12px;
        }
        .mobile {
            text-align: center;
            font-size: 13px;
            color: #af6400;
            margin-bottom: 10px;
        }
        .music-set-title {
            font-weight: 600;
            font-size: 15px;
            color: #ffffff;
            margin-right: 7px;
        }
        .audio-switch {
            border-radius: 20px;
            border: 3px solid #aa660d;
            margin-right: 17px;
        }
        .music-set-move {
            flex: 1;
        }
    }
    .game-list-box {
        height: calc(175px + 72px);
        overflow-y: auto;
        margin-bottom: 25px;
        .game-card-box {
            width: 72px;
            height: 72px;
            background-repeat: no-repeat;
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
    .personal-title {
        margin-bottom: 25px;
        .user-avager {
            width: 36px;
            height: 36px;
            border: 2px solid #0091ed;
            margin-right: 12px;
            border-radius: 50%;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .user-info {
            .user-name {
                font-size: 13px;
                color: #ffffff;
                // -webkit-text-stroke: 2px #1c74f9;
            }
            .user-id {
                font-weight: 500;
                font-size: 10px;
                color: #002b6b;
            }
        }
        .game-report {
            width: 90px;
            height: 30px;
            background: #fcfbf5;
            box-shadow: inset -1px -1px 0px 0px #edc495;
            border-radius: 18px;
            font-weight: 600;
            font-size: 12px;
            color: #7a3d0f;
            padding-left: 6px;
            &::before {
                content: '';
                display: block;
                width: 16px;
                height: 16px;
                background: url('@/assets/images/icon-level-tip.png') no-repeat;
                background-size: 100% 100%;
                margin-right: 6px;
            }
        }
    }
}
</style>
