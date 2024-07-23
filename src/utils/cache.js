import { CacheToken, CacheUserInfo } from '@/constants';
import { isNullOrUndefined } from './index';

const fix = 'v1@';

/**
 * 存储介质适配器
 * @param isSessionStorage
 * @returns
 */
const cacheAdapter = isSessionStorage => {
    return isSessionStorage ? sessionStorage : localStorage;
};

/**
 * 取缓存值
 * @param {*} key
 * @param {*} options
 */
export const getCache = (key, options, defaultValue) => {
    key = fix + key;
    options = { isParse: true, isDelete: false, ...options };
    try {
        const value = cacheAdapter(options.isSessionStorage).getItem(key);
        if (options.isDelete) {
            cacheAdapter(options.isSessionStorage).removeItem(key);
        }
        return isNullOrUndefined(value)
            ? defaultValue
            : options.isParse
              ? value
                  ? JSON.parse(value)
                  : defaultValue
              : value;
    } catch (error) {
        return defaultValue;
    }
};

/**
 * 设置缓存值
 * @param {*} key
 * @param {*} value
 */
export const setCache = (key, value, isSessionStorage) => {
    key = fix + key;
    cacheAdapter(isSessionStorage).setItem(
        key,
        typeof value === 'object' ? JSON.stringify(value) : value
    );
};

/**
 * 清除缓存
 * @param key
 * @param isSessionStorage
 */
export const removeCache = (key, isSessionStorage) => {
    key = fix + key;
    cacheAdapter(isSessionStorage).removeItem(key);
};

export const clearAllCache = isSessionStorage => {
    cacheAdapter(isSessionStorage).clear();
};

export const getToken = () => {
    const tokenItem = getCache(CacheToken, { isSessionStorage: true }, null);
    return tokenItem ? tokenItem['token'] : null;
};
export const getUserInfoCache = () => {
    return getCache(CacheUserInfo, { isSessionStorage: true }, null) || null;
};
