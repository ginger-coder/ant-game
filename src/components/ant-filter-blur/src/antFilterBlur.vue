<!--
  功能：高斯模糊
  作者：bianxiaokai
  时间：2024年07月24日 09:46:23
-->
<template>
    <div class="filter-bg"></div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAppStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
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
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({});
onMounted(() => {
    //console.log('3.-组件挂载到页面之后执行-------onMounted')
});
</script>
<style scoped lang="scss">
.filter-bg {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    top: 0;
    left: 0;
}
</style>
