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
                <div class="level-name align-center">错字练习</div>
            </div>
        </div>
        <div class="game-error-tip">选择您要练习的错字，开始您的闯关之旅吧！</div>
        <div class="game-area-box">
            <div v-for="item in chineseList" :key="item.uid" class="chinese-item">
                <div class="game-card-box align-center" @click="handleChineseClick(item)">
                    <div class="game-check">
                        <img
                            v-if="item.active"
                            src="@/assets/images/icon-checkout-active.png"
                            alt=""
                        />
                        <img v-else src="@/assets/images/icon-checkout-default.png" alt="" />
                    </div>
                    <div class="game-chinese">{{ item.name }}</div>
                </div>
            </div>
        </div>
        <div class="game-join-btn" @click="handleStartGame">
            <img src="@/assets/images/icon-btn-join.png" alt="" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { useAppStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import { v4 as uuidv4 } from 'uuid';
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

const handleChineseClick = item => {
    chineseList.value = chineseList.value.map(el => {
        if (el.uid === item.uid) {
            el.active = !el.active;
        }
        return el;
    });
};

const chineseList = ref([]);

const init = () => {
    api.getWrongBook({
        member_id: 1
    }).then(res => {
        chineseList.value = res.data.map(item => {
            item.active = false;
            item.uid = uuidv4();
            return item;
        });
    });
};

const handleStartGame = () => {
    const workbook = chineseList.value.filter(el => el.active);
    const workids = workbook.map(el => el.id);
    if (workbook.length) {
        router.push({
            name: 'game',
            query: {
                workbook: workids.join(',')
            }
        });
    } else {
        proxy.$showToast('请至少选择一个汉字，再进行练习哦！~');
    }
};

onMounted(() => {
    init();
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
.game-join-btn {
    margin: 0 auto;
    width: 142px;
    height: 56px;
    img {
        width: 100%;
    }
}
.game-area-box {
    padding-top: 18px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: calc(100% - 350px);
    .chinese-item {
        padding: 0 5px;
        margin-bottom: 12px;
    }
    .game-card-box {
        width: 100%;
        height: 64px;
        background: #fefbeb;
        box-shadow:
            0px 2px 4px 0px rgba(29, 116, 0, 0.25),
            inset -2px -2px 1px 0px rgba(223, 151, 95, 0.52),
            inset 2px 2px 1px 0px #ffffff;
        border-radius: 16px;
        padding: 14px 16px;
        .game-check {
            width: 20px;
            height: 20px;
            margin-right: 12px;
            img {
                width: 100%;
                height: 100%;
            }
        }
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
            font-family: 'HYk2gj';
        }
    }
}
</style>
