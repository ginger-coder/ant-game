import { defineStore } from 'pinia';
import baseService from '@/utils/request';
import { removeCache, getToken } from '@/utils/cache';
import { CacheToken } from '@/constants';
import api from '@/api';

export const useAppStore = defineStore('useAppStore', {
    state: () => ({
        state: {
            appIsReady: false,
            appIsLogin: false,
            user: {},
            count: {},
            applyInfo: {},
            isuploaded: false
        }
    }),
    actions: {
        initApplyInfo(applyno) {
            return api.applyBackletterInfo({ applyno }).then(res => {
                this.updateState({
                    applyInfo: res.data.info || {}
                });
            });
        },
        selectStep(val) {
            this.activeStep = val;
        },
        initApp() {
            return Promise.all([
                baseService.get('/console/who?auth_token=' + getToken()), //用户信息
                baseService.get('/console/my_items_count') //个人中心
            ]).then(([user, count]) => {
                if (user.code === 0) {
                    this.updateState({
                        user: user.data.info || {},
                        isuploaded: user.data.isuploaded,
                        count: count.data || {}
                    });
                }
            });
        },
        updateState(data) {
            Object.keys(data).forEach(x => {
                this.state[x] = data[x];
            });
        },
        //退出
        logout() {
            removeCache(CacheToken, true);
            this.updateState({
                user: {}
            });
        }
    }
});
