import axios from 'axios';
import serviceAxios from '@/utils/request';
import serverConfig from '@/utils/config';
import { getToken } from '@/utils/cache';

export const getProductList = data => {
    return serviceAxios({
        url: '/company/product/list',
        method: 'GET',
        params: data
    });
};
export const getMyItemsCount = data => {
    return serviceAxios({
        url: '/console/my_items_count',
        method: 'GET',
        params: data
    });
};

/**
 * 项目分页列表
 */
export const getProjectPageList = data => {
    return serviceAxios({
        url: '/company/project/page_list',
        method: 'GET',
        params: data
    });
};
/**
 * 新增项目
 */
export const projectCreate = data => {
    return serviceAxios({
        url: '/company/project/create',
        method: 'POST',
        data: data
    });
};
/**
 * 上传文件
 */
export const uploadFile2path = data => {
    return serviceAxios({
        url: '/comm/qiniu/upload/file2path',
        method: 'POST',
        headers: {
            'content-type': 'multipart/form-data'
        },
        data: data
    });
};

/**
 * 项目详情
 */
export const getProjectInfo = data => {
    return serviceAxios({
        url: '/company/project/info',
        method: 'GET',
        params: data
    });
};
/**
 * 产品详情
 */
export const getProductInfo = data => {
    return serviceAxios({
        url: '/company/product/info',
        method: 'GET',
        params: data
    });
};
/**
 * 下拉项目列表
 */
export const getOptionProjectList = data => {
    return serviceAxios({
        url: '/company/project/list',
        method: 'GET',
        params: data
    });
};
/**
 * 申请记录列表
 */
export const getApplyBackletterList = data => {
    return serviceAxios({
        url: '/console/apply_backletter/list',
        method: 'GET',
        params: data
    });
};
/**
 * 撤回
 */
export const applyBackletterReCall = data => {
    return serviceAxios({
        url: '/console/apply_backletter/re_call',
        method: 'GET',
        params: data
    });
};

/**
 * 发起申请-提交材料
 */
export const applyBackletterCreate = data => {
    return serviceAxios({
        url: '/console/apply_backletter/create',
        method: 'POST',
        data: data
    });
};
/**
 * 发起申请-获取协议内容
 */
export const applyBackletterQueryProtocol = data => {
    return serviceAxios({
        url: '/console/apply_backletter/query_protocol',
        method: 'GET',
        params: data
    });
};
/**
 * 发起申请-获取保函
 */
export const applyBackletterGetGuarantee = data => {
    return serviceAxios({
        url: '/console/apply_backletter/get_guarantee',
        method: 'GET',
        params: data
    });
};
/**
 * 发起申请-提交协议
 */
export const applyBackletterSubmitProtocol = data => {
    return serviceAxios({
        url: '/console/apply_backletter/submit_protocol',
        method: 'POST',
        data: data
    });
};
/**
 * 发起申请-详情
 */
export const applyBackletterInfo = data => {
    return serviceAxios({
        url: '/console/apply_backletter/info',
        method: 'GET',
        params: data
    });
};
/**
 * 企业基本信息、编辑
 */
export const companyModify = (no, data) => {
    return serviceAxios({
        url: '/console/company/modify?no=' + no,
        method: 'POST',
        data: data
    });
};
/**
 * 企业基本信息、详情
 */
export const companyInfo = data => {
    return serviceAxios({
        url: '/console/company/info',
        method: 'GET',
        params: data
    });
};
/**
 * 企业开票信息、编辑
 */
export const companyInvoiceCreate = data => {
    return serviceAxios({
        url: '/console/company/invoice/create',
        method: 'POST',
        data: data
    });
};
/**
 * 企业开票信息、详情
 */
export const companyInvoiceInfo = data => {
    return serviceAxios({
        url: '/console/company/invoice/info',
        method: 'GET',
        params: data
    });
};
/**
 * 企业开票信息、编辑
 */
export const companyMailCreate = data => {
    return serviceAxios({
        url: '/console/company/mail/create',
        method: 'POST',
        data: data
    });
};
/**
 * 企业开票信息、详情
 */
export const companyMailInfo = data => {
    return serviceAxios({
        url: '/console/company/mail/info',
        method: 'GET',
        params: data
    });
};
/**
 * 获取金额
 */
export const getPayment = data => {
    return serviceAxios({
        url: '/console/apply_backletter/get_payment',
        method: 'GET',
        params: data
    });
};
/**
 * 提交账单
 */
export const surePay = data => {
    return serviceAxios({
        url: '/console/apply_backletter/sure_pay',
        method: 'POST',
        data: data
    });
};
/**
 * 提交账单
 */
export const applyBackletterModifyFiles = data => {
    return serviceAxios({
        url: '/console/apply_backletter/modify_files?no=' + data.no,
        method: 'POST',
        data: data
    });
};
/**
 * 添加优惠券给用户
 */
export const couponsRecordCreate = data => {
    return serviceAxios({
        url: '/console/coupons/coupons_record/create',
        method: 'POST',
        data: data
    });
};
/**
 * 我的优惠券
 */
export const couponsRecordList = data => {
    return serviceAxios({
        url: '/console/coupons/coupons_record/list',
        method: 'GET',
        params: data
    });
};
