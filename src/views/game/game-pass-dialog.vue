<!--
  功能：选择关卡对话框
  作者：bianxiaokai
  时间：2024年07月24日 14:04:26
-->
<template>
    <van-dialog v-model:show="visible" :show-confirm-button="false">
        <div class="game-finish-container">
            <div class="btn-box">
                <div v-if="props.type == 1" class="game-btn" @click="handleNext">
                    <img src="@/assets/images/game-next.png" alt="" />
                </div>
                <div class="back-home" @click="backHome">返回首页</div>
            </div>
        </div>
    </van-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const emits = defineEmits(['callback']);
const props = defineProps({
    type: {
        type: Number,
        default: 0
    }
});
const router = useRouter();

const visible = ref(false);
const init = () => {
    visible.value = true;
};

const handleNext = () => {
    visible.value = false;
    emits('callback');
};

const backHome = () => {
    visible.value = false;
    if (props.type === 0) {
        router.replace('/error');
    } else {
        router.replace('/home');
    }
};

defineExpose({ init });
</script>
<style scoped lang="scss">
.game-finish-container {
    width: 267px;
    height: 478px;
    background: url('@/assets/images/game-pass.png') no-repeat;
    background-size: 100% auto;
    position: relative;
    margin: 0 auto;
    .btn-box {
        position: absolute;
        top: 320px;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .back-home {
            text-align: center;
            font-weight: 500;
            font-size: 14px;
            color: #7a3d0f;
        }
    }
    .game-btn {
        width: 114px;
        height: 45px;
        margin-bottom: 10px;
        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
