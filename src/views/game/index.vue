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
                <div class="level-name align-center">{{ tipInfo.level_name }}</div>
                <div class="game-time align-center">
                    剩余时间：
                    <span v-if="tipInfo.time_limit == 0" class="t">无限制</span>
                    <van-count-down
                        v-else
                        :time="countDownTimer"
                        style="color: #fdbb27; font-weight: 800"
                        format="mm:ss"
                        @finish="onGameTimeEnd"
                        @change="onTimeChange"
                    />
                </div>
            </div>
            <ant-progress-line :percentage="remainderTime" style="margin-bottom: 12px" />
            <div class="game-tip">
                <div v-if="tipInfo.grade_name" class="game-tip-item">{{ tipInfo.grade_name }}</div>
                <div v-if="tipInfo.difficulty_name" class="game-tip-item">
                    {{ tipInfo.difficulty_name }}
                </div>
                <div class="game-tip-item">
                    剩余数量：<span>{{ otherNum.length }}</span>
                </div>
                <div class="game-tip-item">
                    错误数量：<span>{{ errorNum.length }}</span>
                </div>
            </div>
        </div>
        <div class="game-area-box">
            <ant-game-wait v-if="isWaitGame" ref="gameWaitRef" @end="onWaitTimeEnd" />
            <div v-else class="game-content">
                <div class="game-tip-top">
                    <template v-if="chineseItemInfo.id">
                        <div class="game-tip-card">
                            <div class="chinese-info">{{ chineseItemInfo.name }}</div>
                            <div class="chinese-tip">
                                <div class="chinese-read chinese-font">
                                    读音：<span>{{ chineseItemInfo.pronunciation }}</span>
                                </div>
                                <div class="chinese-left chinese-font">
                                    部首：<span>{{ chineseItemInfo.radical }}</span>
                                </div>
                            </div>
                            <div class="chinese-other">
                                <div
                                    class="chinese-audio"
                                    @click="handlePalyAudio(chineseItemInfo.file)"
                                >
                                    <img src="@/assets/images/icon-audio.png" width="16px" alt="" />
                                </div>
                                <div class="chinese-num chinese-font">
                                    笔画：<span>{{ chineseItemInfo.strokes }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <!-- <div class="game-content-desc">选择偏旁和部首组成一个汉字</div> -->
                <line-game
                    :data="chineseList"
                    :refresh="tolerance"
                    @error="handleErrorClick"
                    @other="handleOther"
                    @finish="handleFinish"
                    @success="startShowChineseInfo"
                />
            </div>
        </div>
        <game-over-dialog ref="gameOverDialogRef" :type="gameType" @callback="handleNext(0)" />
        <game-pass-dialog ref="gamePassDialogRef" :type="gameType" @callback="handleNext(1)" />
        <audio ref="audioRef" style="width: 0; height: 0"></audio>
    </div>
</template>

<script setup>
import _ from 'lodash';
import gameOverDialog from './game-over-dialog.vue';
import gamePassDialog from './game-pass-dialog.vue';
import lineGame from './line.vue';
import { getUserInfo } from '@/utils/cache';
import { ref, reactive, onMounted, getCurrentInstance, watch, computed, onDeactivated } from 'vue';
import { useAppStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import { v4 as uuidv4 } from 'uuid';
import { uniqueJsonArrByField } from '@/utils';
const { proxy } = getCurrentInstance();
import cnchar from 'cnchar';
import 'cnchar-radical';

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

// 当前关卡数据id值
let levelData = ref({});

const gameType = ref(0); // 游戏类型 0-闯关 1-练习

const gameWaitRef = ref();
const gameOverDialogRef = ref();
const gamePassDialogRef = ref();
const isWaitGame = ref(true);
const tipInfo = ref({
    difficulty_name: '',
    grade_name: '',
    level_name: '',
    time_limit: 0,
    tolerance: 0
});
const chineseList = ref([]);
const selectChinese = ref([]);

const rightNum = ref([]);
const errorNum = ref([]);
const otherNum = ref([]);

let startTime = 0;
let timing = null;

const audioRef = ref();
const handlePalyAudio = url => {
    audioRef.value.src = url;
    // 播放 暂停也同理
    audioRef.value.play();
};

const startTiming = () => {
    timing = setInterval(() => {
        startTime++;
    }, 1000);
};
const finishTiming = () => {
    clearInterval(timing);
};

let passTimer = null;

// 下一关
const handleNext = () => {
    const findLevelIndex = store.state.levels.findIndex(
        item => item.id === Number(levelData.value.level_id)
    );
    const nextIndex = findLevelIndex + 1;
    if (nextIndex < store.state.levels.length) {
        const nextId = store.state.levels[nextIndex].id;
        // 跳转下一关
        passTimer = setTimeout(() => {
            router.replace({
                name: 'game',
                query: {
                    level_id: nextId,
                    grade_id: levelData.value.grade_id,
                    difficulty_id: levelData.value.difficulty_id
                }
            });
        }, 500);
    } else {
        proxy.$showToast('恭喜，小朋友你已经通关啦~');
    }
};

const handleErrorClick = item => {
    errorNum.value.push(item);
};

const handleFinish = () => {
    finishTiming();
    gamePassDialogRef.value.init();
    if (!route.query.workbook) {
        submitGameData(1);
    }
};

const submitGameData = type => {
    isFinish.value = true;
    let rightArr = uniqueJsonArrByField(
        chineseList.value.filter(item => {
            const target = errorNum.value.findIndex(el => el.id === item.id);
            if (target === -1) {
                return true;
            }
            return false;
        }),
        'id'
    );
    api.handelLevelSubmit({
        member_id: userInfo.value.id,
        level_id: Number(levelData.value.level_id),
        grade_id: Number(levelData.value.grade_id),
        difficulty_id: Number(levelData.value.difficulty_id),
        duration: type ? startTime : '',
        false_num: errorNum.value.length,
        true_num: rightArr.length,
        status: type ? 1 : 2,
        true_character: rightArr.map(el => el.id).join(','),
        false_character: errorNum.value.map(el => el.id).join(',')
    }).then(() => {
        // 清空计时--0秒
        startTime = 0;
    });
};

const remainderTime = ref(0);
const countDownTimer = computed(() => {
    return tipInfo.value.time_limit * 1000 * 60;
});
const onTimeChange = val => {
    const remain = countDownTimer.value - val.total;
    remainderTime.value = (remain / countDownTimer.value) * 100;
};

const chineseItemInfo = ref({});

const isFinish = ref(false);

const handleOther = arr => {
    otherNum.value = _.cloneDeep(arr);
};
const start = () => {
    gameWaitRef.value && gameWaitRef.value.start();
};

const chineseInfoTimer = ref(null);
const startShowChineseInfo = chinese => {
    clearTimeout(chineseInfoTimer.value);
    audioRef.value.pause();
    chineseItemInfo.value = _.cloneDeep(chinese);
    chineseInfoTimer.value = setTimeout(() => {
        chineseItemInfo.value = {};
        audioRef.value.pause();
        clearTimeout(chineseInfoTimer.value);
    }, 5000);
};

const onGameTimeEnd = () => {
    // 游戏结束
    finishTiming();
    if (!isFinish.value) {
        gameOverDialogRef.value.init();
        if (!route.query.workbook) {
            submitGameData(0);
        }
    } else {
        gamePassDialogRef.value.init();
        if (!route.query.workbook) {
            submitGameData(1);
        }
    }
};

const tolerance = ref(0);

const gameInfo = data => {
    api.getLevelInfo({
        memberid: userInfo.value.id,
        level_id: data.level_id,
        grade_id: data.grade_id,
        difficulty_id: data.difficulty_id
    }).then(res => {
        if (res.data.characters.length) {
            start();
            tolerance.value = res.data.tolerance;
            chineseList.value = res.data.characters
                ? res.data.characters.map(item => {
                      item.active = false;
                      item.uid = uuidv4();
                      return item;
                  })
                : [];
            otherNum.value = _.cloneDeep(chineseList.value);
            tipInfo.value = res.data;
            if (res.data.time_limit === 0) {
                remainderTime.value = 100;
            }
        } else {
            proxy.$showToast('该关卡没有数据');
            router.back();
        }
    });
};

const workTimer = ref();

const workInfo = data => {
    remainderTime.value = 100;
    api.getWrongBookList({
        characters_ids: data.workbook || ''
    }).then(res => {
        chineseList.value = res.data.characters.map(el => {
            el.active = false;
            el.uid = uuidv4();
            return el;
        });
        otherNum.value = _.cloneDeep(chineseList.value);
        tipInfo.value.level_name = '练习';
        workTimer.value = setTimeout(() => {
            start();
        }, 500);
    });
};

const userInfo = computed(() => {
    return getUserInfo();
});

watch(
    () => route.query,
    data => {
        if (data.workbook) {
            gameType.value = 0;
            workInfo(data);
        } else {
            gameType.value = 1;
            levelData.value = data;
            gameInfo(data);
            if (!store.state.levels.length) {
                store.getLevelList(userInfo.value.id);
            }
        }
    },
    {
        immediate: true,
        deep: true
    }
);

const onWaitTimeEnd = () => {
    isWaitGame.value = false;
    startTiming();
    console.log('倒计时结束');
};

onDeactivated(() => {
    clearTimeout(chineseInfoTimer.value);
    clearTimeout(workTimer.value);
    clearTimeout(passTimer);
});
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
            font-size: 14px;
            color: #ffffff;
            -webkit-text-stroke: 1px #b06400;
            line-height: 16px;
            &::before {
                content: '';
                display: block;
                width: 20px;
                height: 20px;
                background: url('@/assets/images/icon-level-tip.png') no-repeat;
                background-size: 100% 100%;
                margin-right: 5px;
            }
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
        &.active {
            background: url('@/assets/images/select-cha-bg-active.png') no-repeat;
            background-size: 100% 100%;
            color: #ffffff;
            -webkit-text-stroke: 1px #082350;
        }
    }
}

.game-area-box {
    padding-top: 12px;
}
.game-content {
    .game-tip-top {
        width: 243px;
        height: 80px;
        margin: 0 auto;
        .game-tip-card {
            width: 100%;
            height: 100%;
            background: url('@/assets/images/icon-tip-bg.png') no-repeat;
            background-size: 100% 100%;

            padding: 18px 20px;
            display: flex;
            align-items: center;
            margin-bottom: 32px;
        }

        .chinese-info {
            font-family: 'HYk2gj';
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
