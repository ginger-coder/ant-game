<!--
  功能：选择关卡对话框
  作者：bianxiaokai
  时间：2024年07月24日 14:04:26
-->
<template>
    <van-dialog v-model:show="visible" :show-confirm-button="false" :close-on-click-overlay="true">
        <div class="select-level-box">
            <div class="select-level-content">
                <div class="level-grade-box">
                    <!-- <div class="level-grade-icon m5">
                        <img src="@/assets/images/icon-point.png" alt="" />
                    </div> -->
                    <span class="level-grade-text">识字范围：</span>
                    <van-popover
                        v-model:show="showGrade"
                        :actions="gradeList"
                        @select="handleGrade"
                    >
                        <template #reference>
                            <div class="select-item m5">{{ activeGrade?.text }}</div>
                        </template>
                    </van-popover>
                    <!-- <div class="level-grade-icon m5">
                        <img src="@/assets/images/icon-star.png" alt="" />
                    </div> -->
                    <van-popover
                        v-model:show="showLevel"
                        :actions="levelList"
                        @select="handleLevel"
                    >
                        <template #reference>
                            <div class="select-item">{{ activeLevel.text }}</div>
                        </template>
                    </van-popover>
                </div>
                <!-- <div class="level-tip">
                    选择合适的偏旁和部首，组成一个汉字进行消除，加油！胜利在等着你
                </div> -->
                <!-- 关卡列表 -->
                <div class="level-list-box">
                    <div
                        v-for="(item, index) in level_number"
                        :key="item"
                        class="level-item"
                        @click="handelStart(item)"
                    >
                        <img :src="getAssetsFile(`icon-level-${index + 1}.png`)" alt="" />
                    </div>
                </div>
            </div>
            <!-- <div class="level-game-start" @click="handelStart">
                <img src="@/assets/images/icon-btn-start.png" alt="" />
            </div> -->
        </div>
    </van-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed, getCurrentInstance, watch } from 'vue';
import { useAppStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { getAssetsFile } from '@/utils';
const { proxy } = getCurrentInstance();
import api from '@/api';
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

const showGrade = ref(false);

const showLevel = ref(false);

const level_number = computed(() => {
    return store.state.levels;
});
const gradeList = computed(() => {
    return store.state.gradeList;
});
const levelList = computed(() => {
    return store.state.leveList;
});

const activeGrade = ref({
    id: '',
    name: ''
});
const activeLevel = ref({
    id: '',
    name: ''
});

watch(
    () => store.state.gradeList,
    value => {
        activeGrade.value = value[0];
    },
    {
        deep: true
    }
);
watch(
    () => store.state.leveList,
    value => {
        activeLevel.value = value[0];
    },
    {
        deep: true
    }
);

const visible = ref(false);

const getLevelId = id => {
    const targetIndex = level_number.value.findIndex(item => item.id === id);
    if (targetIndex === 0) {
        return true;
    }
    const targetLevel = level_number.value.find(item => item.id === id);
    return targetLevel.is_pass;
};

const handelStart = level => {
    if (!getLevelId(level.id)) {
        proxy.$showToast('请先完成上一关哦~');
        return;
    }
    router.push({
        name: 'game',
        query: {
            level_id: level.id,
            grade_id: activeGrade.value.id,
            difficulty_id: activeLevel.value.id
        }
    });
};

const handleLevel = (actions, index) => {
    activeLevel.value = actions;
};
const handleGrade = (actions, index) => {
    activeGrade.value = actions;
};

const init = () => {
    visible.value = true;
    const member_id = store.state.user.id;
    store.getLevelList(member_id);
    store.getManageInfo('grade');
    store.getManageInfo('difficulty');
};

defineExpose({ init });
</script>
<style scoped lang="scss">
.select-level-box {
    width: 100%;
    .select-level-content {
        width: 100%;
        height: 482px;
        background: url('@/assets/images/icon-level-bg.png') no-repeat;
        background-size: 100% 100%;
        margin-bottom: 63px;
        padding: 107px 48px 0 48px;
    }
    .level-grade-box {
        display: flex;
        width: 215px;
        height: 58px;
        background: #c45d08;
        box-shadow: inset 0px 1px 3px 0px rgba(189, 88, 29, 0.95);
        border-radius: 8px;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        .level-grade-icon {
            width: 24px;
            height: 24px;
            img {
                width: 100%;
            }
        }
    }
    .level-tip {
        text-align: center;
        font-weight: 500;
        font-size: 11px;
        color: #b3571f;
        padding: 12px 0 15px;
    }
}

.level-grade-text {
    font-weight: 600;
    font-size: 13px;
    color: #ffdbdb;
}

.select-item {
    width: 62px;
    height: 26px;
    background: #fcfbf5;
    box-shadow: inset -1px -1px 0px 0px #edc495;
    border-radius: 11px;
    font-weight: 600;
    font-size: 12px;
    color: #af6400;
    padding: 0 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &::after {
        content: '';
        width: 4px;
        height: 7px;
        background: url('@/assets/images/icon-level-select.png') no-repeat;
        background-size: 100% 100%;
    }
}

.level-list-box {
    display: flex;
    flex-flow: wrap;
    justify-content: space-around;
    .level-item {
        width: 48px;
        height: 55px;
        margin-bottom: 15px;
        img {
            width: 100%;
            height: 100%;
        }
    }
}

.level-game-start {
    width: 142px;
    height: 56px;
    margin: 0 auto;
    img {
        width: 100%;
    }
}
.m5 {
    margin-right: 5px;
}
</style>
