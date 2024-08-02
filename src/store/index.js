import { defineStore } from 'pinia';
import api from '@/api';
import { set } from 'nprogress';

export const useAppStore = defineStore('useAppStore', {
    state: () => ({
        state: {
            user: {
                id: 0,
                nickname: '',
                mobile: '', //手机号码
                record: 0,
                avatar: '',
                learn_num: 1,
                exceed_num: '100%',
                best_game: '连连看', //最好的游戏
                best_level: '暂无通关记录', //成功闯到了第几关
                fastest_leven: '暂无通关记录', //最快通过的关卡
                game_list: [],
                full_avatar: ''
            },
            levels: [],
            current_level: {}
        }
    }),
    actions: {
        getLevelList(member_id) {
            api.getLevelList({ member_id }).then(res => {
                this.updateState({ levels: res.data });
            });
        },
        setCurrentLevel(data) {
            this.updateState({ current_level: data });
        },
        setUserInfo(member_id) {
            api.getmMemberInfo({
                member_id
            }).then(res => {
                this.updateState({ user: res.data });
            });
        },
        updateState(data) {
            Object.keys(data).forEach(x => {
                this.state[x] = data[x];
            });
        }
    }
});
