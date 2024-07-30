import { defineStore } from 'pinia';
import api from '@/api';

export const useAppStore = defineStore('useAppStore', {
    state: () => ({
        state: {
            user: {},
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
        updateState(data) {
            Object.keys(data).forEach(x => {
                this.state[x] = data[x];
            });
        }
    }
});
