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
                    <div class="level-grade-icon m5">
                        <img src="@/assets/images/icon-point.png" alt="" />
                    </div>
                    <van-popover
                        v-model:show="showGrade"
                        :actions="gradeList"
                        @select="handleGrade"
                    >
                        <template #reference>
                            <div class="select-item m5">{{ activeGrade.text }}</div>
                        </template>
                    </van-popover>
                    <div class="level-grade-icon m5">
                        <img src="@/assets/images/icon-star.png" alt="" />
                    </div>
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
                <div class="level-tip">
                    选择合适的偏旁和部首，组成一个汉字进行消除，加油！胜利在等着你
                </div>
                <!-- 关卡列表 -->
                <div class="level-list-box">
                    <div v-for="(item, index) in level_number" :key="item" class="level-item">
                        <img :src="getAssetsFile(`icon-level-${index + 1}.png`)" alt="" />
                    </div>
                </div>
            </div>
            <div class="level-game-start" @click="handelStart">
                <img src="@/assets/images/icon-btn-start.png" alt="" />
            </div>
        </div>
    </van-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed, getCurrentInstance } from 'vue';
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

const activeGrade = ref({
    id: 1,
    text: '一年级'
});
const showGrade = ref(false);
const gradeList = [
    { text: '一年级', id: 1 },
    { text: '二年级', id: 2 },
    { text: '三年级', id: 3 },
    { text: '四年级', id: 4 },
    { text: '五年级', id: 5 },
    { text: '六年级', id: 6 }
];

const activeLevel = ref({
    id: 1,
    text: '简单'
});
const showLevel = ref(false);
const levelList = [
    { text: '简单', id: 1 },
    { text: '中等', id: 2 },
    { text: '困难', id: 3 }
];

const level_number = computed(() => {
    return store.state.levels;
});
const visible = ref(false);

const getLevelId = () => {
    for (let i = 0; i < level_number.value.length; i++) {
        const el = level_number.value[i];
        if (!el.is_pass) {
            return level_number.value[i].id;
        }
    }
    return false;
};

const handelStart = () => {
    const level_id = getLevelId();
    if (!level_id) {
        proxy.$showToast('恭喜，小朋友你已经通关啦~');
        return;
    }
    router.push({
        name: 'game',
        query: {
            level_id,
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

const init = (member_id = 1) => {
    visible.value = true;
    store.getLevelList(member_id);
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
