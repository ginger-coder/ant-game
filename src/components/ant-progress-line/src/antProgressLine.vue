<!--
  功能：初始化功能描述
  作者：bianxiaokai
  时间：2024年07月24日 17:01:18
-->
<template>
    <div class="progress-line-box">
        <div class="progress-line-active" :style="{ width: centage + '%' }"></div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
    percentage: { type: Number, default: 0 }
});

const centage = computed(() => {
    return props.percentage;
});
</script>
<style scoped lang="scss">
.progress-line-box {
    width: 100%;
    height: 20px;
    border: 3px solid rgb(170, 102, 13);
    padding: 2px;
    position: relative;
    border-radius: 10px;
    .progress-line-active {
        min-width: 2px;
        max-width: 100%;
        background: #fdbb27;
        box-shadow: inset -2px -2px 0px 0px #f58310;
        border-radius: 10px;
        height: 10px;
        position: absolute;
        left: 2px;
        top: 2px;
        transition: width 0.5s;
    }
}
</style>
