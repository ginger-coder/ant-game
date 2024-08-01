<!--
  功能：进入等待
  作者：bianxiaokai
  时间：2024年07月24日 08:19:14
-->
<template>
    <div class="progress-box">
        <!--背景 -->
        <div class="progress-bg"></div>
        <div class="progress-info">
            <div class="tip">
                抵制不良游戏，拒绝盗版游戏。 <br />
                注意自我保护，谨防受骗上当。<br />
                适度游戏益脑，沉迷游戏伤身。 <br />
                合理安排时间，享受健康生活。
            </div>
        </div>
        <div class="progress-loading">
            <div class="progress-title">加载中...</div>
            <div class="progress-loading-box">
                <ant-progress-line :percentage="percent" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAppStore } from '@/store';
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const props = defineProps({
    percentage: { type: Number, default: 0 }
});

const percent = computed(() => {
    return props.percentage;
});
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
.progress-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
}
.progress-info {
    width: 284px;
    height: 174px;
    position: absolute;
    top: 200px;
    left: 50%;
    margin-left: -142px;
    z-index: 2;
    background: url('@/assets/images/icon-progress-info.png') no-repeat;
    background-size: 100% auto;
    padding-top: 50px;
    padding-left: 18px;
    .tip {
        font-weight: 500;
        font-size: 12px;
        color: #7a3d0f;
        line-height: 20px;
        letter-spacing: 1px;
        text-align: center;
    }
}
.progress-loading {
    width: 295px;
    position: absolute;
    bottom: 80px;
    left: 50%;
    margin-left: -145px;
    z-index: 2;
    .progress-title {
        font-weight: 600;
        font-size: 14px;
        color: #fff;
        text-align: center;
        margin-bottom: 30px;
    }
    .progress-loading-box {
        width: 100%;
    }
}
</style>
