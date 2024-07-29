import api from '@/api';
const getURLParam = function (name, targetUrl) {
    let reg = new RegExp('[?&]' + name + '=([^&]+)');
    targetUrl = targetUrl || window.location.search;
    let newurl = decodeURIComponent(targetUrl);
    return newurl.match(reg) ? RegExp.$1 : null;
};
// 获取微信用户code
export const getCode = async () => {
    let appid = 'wxdcf14ac8c121f479'; // 这里就是微信提供的测试appid
    let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(location.href)}&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect`;
    const _code = getURLParam('code', location.href);
    //如果没有code 去获取code
    if (_code === null) {
        window.location.href = url;
    } else {
        //获取到code传递给后端获取token
        await getToken(_code);
    }
};
const getToken = code => {
    // 调用后端接口
    api.login(code).then(res => {});
};
