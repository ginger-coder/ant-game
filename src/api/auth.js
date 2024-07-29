import serviceAxios from '@/utils/request';

export const login = data => {
    return serviceAxios({
        url: '/index/login',
        method: 'get',
        params: data
    });
};
