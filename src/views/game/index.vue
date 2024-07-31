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
                    剩余数量：<span>{{ otherNum }}</span>
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
                                <div class="chinese-audio">
                                    <img src="@/assets/images/icon-audio.png" width="16px" alt="" />
                                </div>
                                <div class="chinese-num chinese-font">
                                    笔画：<span>{{ chineseItemInfo.strokes }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="game-content-desc">选择偏旁和部首组成一个汉字</div>
                <div class="game-chinese-box">
                    <div v-for="item in chineseList" :key="item.uid" class="game-chinese-item">
                        <div
                            class="game-chinese-item-c"
                            :class="{ active: item.active }"
                            @click="handleChineseItemClick(item)"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <game-over-dialog ref="gameOverDialogRef" :type="gameType" @callback="handleNext(0)" />
        <game-pass-dialog ref="gamePassDialogRef" :type="gameType" @callback="handleNext(1)" />
    </div>
</template>

<script setup>
import gameOverDialog from './game-over-dialog.vue';
import gamePassDialog from './game-pass-dialog.vue';
import { ref, reactive, onMounted, getCurrentInstance, watch, computed, onDeactivated } from 'vue';
import { useAppStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import { v4 as uuidv4 } from 'uuid';
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
const otherNum = ref(0);

let startTime = 0;
let timing = null;
const startTiming = () => {
    timing = setInterval(() => {
        startTime++;
    }, 1000);
};
const finishTiming = () => {
    clearInterval(timing);
};

// 下一关
const handleNext = () => {
    console.log('startTime', startTime);

    const findLevelIndex = store.state.levels.findIndex(
        item => item.id === levelData.value.level_id
    );
    const nextIndex = findLevelIndex + 1;
    if (nextIndex < store.state.levels.length) {
        const nextId = store.state.levels[nextIndex].id;
        // 跳转下一关
        router.replace({
            name: 'game',
            query: {
                level_id: nextId,
                grade_id: levelData.value.grade_id,
                difficulty_id: levelData.value.difficulty_id
            }
        });
    }
};

const submitGameData = type => {
    api.handelLevelSubmit({
        member_id: 1,
        level_id: Number(levelData.value.level_id),
        grade_id: Number(levelData.value.grade_id),
        difficulty_id: Number(levelData.value.difficulty_id),
        duration: type ? startTime : '',
        false_num: errorNum.value.length,
        true_num: chineseList.value.length - errorNum.value.length,
        status: type ? 1 : 2,
        true_character: rightNum.value.map(el => el.id).join(','),
        false_character: errorNum.value.map(el => el.id).join(',')
    }).then(() => {
        // 清空计时--0秒
        startTime = 0;
    });
};

const remainderTime = ref(0);
const countDownTimer = computed(() => {
    return tipInfo.value.time_limit * 1000;
});
const onTimeChange = val => {
    const remain = countDownTimer.value - val.total;
    remainderTime.value = (remain / countDownTimer.value) * 100;
};

const chineseItemInfo = ref({});

watch(
    () => chineseList.value,
    newList => {
        const isFinish = newList.every(item => item.active);
        if (isFinish) {
            // game over dialog
            finishTiming();
            gamePassDialogRef.value.init();
            if (!route.query.workbook) {
                submitGameData(1);
            }
        }
        otherNum.value = newList.filter(item => !item.active).length;
    },
    {
        deep: true
    }
);
const start = () => {
    gameWaitRef.value && gameWaitRef.value.start();
};

// 点击文字逻辑
const handleChineseItemClick = item => {
    if (item.active) {
        return false;
    }
    chineseList.value = chineseList.value.map(el => {
        if (el.uid === item.uid) {
            const isRight = determineChineseSame(el);
            if (isRight) {
                el.active = true;
            }
        }
        return el;
    });
};

const chineseInfoTimer = ref(null);
const startShowChineseInfo = () => {
    chineseInfoTimer.value = setTimeout(() => {
        chineseItemInfo.value = {};
        clearTimeout(chineseInfoTimer.value);
    }, 5000);
};

const determineChineseSame = el => {
    let falg = false;
    if (selectChinese.value.length < 2) {
        selectChinese.value.push(el);
        falg = true;
    }
    if (selectChinese.value.length === 2) {
        if (selectChinese.value[0].id === selectChinese.value[1].id) {
            chineseItemInfo.value = Object.assign(selectChinese.value[0], {
                radical: cnchar.radical(selectChinese.value[0].name)[0].radical
            });
            startShowChineseInfo();
            falg = true;
            rightNum.value.push(selectChinese.value[0]);
            selectChinese.value = [];
        } else {
            falg = false;
            selectChinese.value.pop();
            errorNum.value.push(selectChinese.value[1]);
            proxy.$showToast('错误');
        }
    }
    return falg;
};

const onGameTimeEnd = () => {
    // 游戏结束
    const isFinish = chineseList.value.every(item => item.active);
    finishTiming();
    if (!isFinish) {
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

const gameInfo = data => {
    api.getLevelInfo({
        level_id: data.level_id,
        grade_id: data.grade_id,
        difficulty_id: data.difficulty_id
    }).then(res => {
        if (res.data.characters.length) {
            start();
            chineseList.value = res.data.characters
                ? res.data.characters.map(item => {
                      item.active = false;
                      item.uid = uuidv4();
                      return item;
                  })
                : [];
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
    chineseList.value = JSON.parse(data.workbook).map(el => {
        el.active = false;
        return el;
    });
    tipInfo.value.level_name = '练习';
    workTimer.value = setTimeout(() => {
        start();
    }, 500);
};
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
    padding-top: 18px;
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
