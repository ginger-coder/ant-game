<!--
  功能：按钮
  作者：bianxiaokai
  时间：2024年04月24日 10:40:48
-->
<template>
    <div class="fin-submit" :style="submitStyle">{{ props.submitText }}</div>
</template>
<script setup>
const props = defineProps({
    // 提交按钮
    submit: {
        type: Boolean,
        default: false
    },
    // 提交按钮文本
    submitText: {
        type: String,
        default: '提交'
    },
    // 提交按钮样式
    submitStyle: {
        type: Object,
        default: () => {
            return {};
        }
    }
});
</script>
<style scoped lang="scss">
.fin-submit {
    width: 100%;
    height: 44px;
    background: linear-gradient(180deg, #654ee6 0%, #3526c9 100%);
    box-shadow: 0px 2px 4px 0px rgba(53, 38, 201, 0.5);
    border-radius: 22px;
    z-index: 9;
    font-weight: 500;
    font-size: 15px;
    color: #ffffff;
    line-height: 44px;
    text-align: center;
}
</style>
