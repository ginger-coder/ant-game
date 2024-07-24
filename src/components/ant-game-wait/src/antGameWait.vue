<!--
  功能：游戏准备倒计时
  作者：bianxiaokai
  时间：2024年07月24日 17:33:41
-->
<template>
    <div class="game-wait-content">
        <div class="game-wait-box">{{ num }}</div>
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
const num = ref(3);

const emits = defineEmits(['end']);
const start = () => {
    num.value = 3;
    const timer = setInterval(() => {
        if (num.value > 0) {
            num.value--;
        } else {
            clearInterval(timer);
            emits('end');
        }
    }, 1000);
};

defineExpose({ start });
</script>
<style scoped lang="scss">
.game-wait-content {
    width: 100%;
    padding-top: 100px;
}
.game-wait-box {
    background: url('@/assets/images/icon-bg-time.png') no-repeat;
    background-size: 100% 100%;
    width: 168px;
    height: 168px;
    text-align: center;
    line-height: 168px;
    font-size: 108px;
    color: #7a3d0f;
    margin: 0 auto;
}
</style>
