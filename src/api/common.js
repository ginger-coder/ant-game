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
// 错字练习
export const getWrongBook = data => {
    return serviceAxios({
        url: '/index/wrong_book',
        method: 'post',
        data
    });
};
// 错字练习List
export const getWrongBookList = data => {
    return serviceAxios({
        url: '/index/exercise',
        method: 'post',
        data
    });
};
// login
export const requestForToken = code => {
    return serviceAxios({
        url: '/index/loginRes',
        method: 'post',
        data: { code }
    });
};
// 用记详情
export const getmMemberInfo = data => {
    return serviceAxios({
        url: '/index/memberInfo',
        method: 'post',
        data
    });
};

// 难易、年级
export const getinfoManage = data => {
    return serviceAxios({
        url: '/index/infoManage',
        method: 'post',
        data
    });
};
