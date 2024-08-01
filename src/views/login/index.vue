<!--
  功能：登录页
  作者：bianxiaokai
  时间：2024年07月23日 17:07:20
-->
<template>
    <div class="container index-bg">
        <div class="game-logo">
            <div class="logo-image">
                <img src="@/assets/images/logo.png" width="116px" alt="" />
            </div>
        </div>
        <div class="game-join-btn">
            <img src="@/assets/images/icon-btn-join.png" alt="" />
        </div>
        <ant-progress :percentage="prog" />
        <ant-filter-blur />
    </div>
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

let timer = null;
const prog = ref(0);
onMounted(() => {
    timer = setInterval(function () {
        if (prog.value < 100) {
            prog.value = prog.value + Math.random() * 5;
        } else {
            clearInterval(timer);
            router.replace('/home');
        }
    }, 100);
});
</script>
<style scoped lang="scss">
.container {
    position: relative;
}
.game-logo {
    width: 304px;
    height: 127px;
    background: rgba(255, 255, 255, 0.44);
    border-radius: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 44px;
    left: 50%;
    margin-left: -152px;
}
.game-join-btn {
    width: 142px;
    height: 56px;
    position: absolute;
    bottom: 72px;
    left: 50%;
    margin-left: -71px;
    img {
        width: 100%;
    }
}
</style>
