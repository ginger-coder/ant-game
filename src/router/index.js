import { createRouter, createWebHashHistory, useRoute } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useAppStore } from '@/store';
import { getToken } from '@/utils/cache';
// 1. 定义路由组件.
// 也可以从其他文件导入

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
    {
        path: '/',
        redirect: 'login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: 'Login' */ '@/views/login/index.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: 'Home' */ '@/views/home/index.vue')
    }
];

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes // `routes: routes` 的缩写
});
const noTokenPath = ['/auth/login', '/auth/register'];
router.beforeEach((to, from, next) => {
    const store = useAppStore();
    const token = getToken();
    console.log('token', token);
    NProgress.start();
    // if (!store.state.appIsReady) {
    //     if (noTokenPath.findIndex(e => to.path === e) === -1) {
    //         if (token) {
    //             store.initApp().then(() => {
    //                 store.updateState({
    //                     appIsReady: true,
    //                     appIsLogin: true
    //                 });
    //                 next({ ...to, replace: true });
    //             });
    //         } else {
    //             next('/auth/login');
    //         }
    //     } else {
    //         next();
    //     }
    // } else {
    //     store.initApp();
    //     next();
    // }
    next();
});
// 路由加载后
router.afterEach(() => {
    NProgress.done();
});

export default router;
