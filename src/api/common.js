import serviceAxios from '@/utils/request';

export const getLevelList = data => {
    return serviceAxios({
        url: '/index/level',
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data
    });
};
export const getLevelInfo = data => {
    return serviceAxios({
        url: '/index/levelInfo',
        method: 'post',
        data
    });
};
export const handelLevelSubmit = data => {
    return serviceAxios({
        url: '/index/levelSubmit',
        method: 'post',
        data
    });
};
