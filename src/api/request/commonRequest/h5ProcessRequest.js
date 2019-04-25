import Axios from 'axios';
import qs from 'qs';
import cookie from '@/utils/cookie';
// import storage from '@/utils/storage';
// import { appPostMessage } from '@/utils/common';

// 创建Axios实例
const service = Axios.create({
  // baseURL: process.env.NODE_ENV === "development" ? "/api_service/" : "/iqiyi_api/" // api的base_url
  baseURL: process.env.NODE_ENV === 'development' ? '/api_service/' : '/', // api的base_url
  // timeout: 60000,  // 请求超时时间
  headers: { cc: 'JINXIANG' }
});

// 拦截每一次请求, 在请求发送之前做一些操作
service.interceptors.request.use(
  async config => {
    return config;
  },
  error => Promise.reject(error)
);

// 拦截每一次请求返回结果，并对结果进行处理
service.interceptors.response.use(
  // 获取后台返回的json数据
  response => {
    return Promise.resolve(response);
    // console.log(response);
    // let status = response.data.status;
    // if (status == 200 || status == 203) {
    //   return Promise.resolve(response);
    // } else if (status === 302) { // 后台返回302
    //   // 判断是否从app中过来的交互页面
    //   if (cookie.get('from') == 'app') {
    //     storage.clear(); // 清空localstorage中的数据
    //     cookie.set('sid', '', -1); // 删除cookie中的sid和uid
    //     cookie.set('uid', '', -1);
    //     cookie.set('from', '', -1);
    //     let message = {
    //       type: 'login',
    //       actions: 'loginExpire',
    //       result: 1
    //     };
    //     appPostMessage(message);
    //   } else {
    //     storage.clear(); // 清空localstorage中的数据
    //     cookie.set('sid', '', -1); // 删除cookie中的sid和uid
    //     cookie.set('uid', '', -1);
    //     router.replace({ name: 'login' }); // 跳转到登录页
    //   }
    // } else if (response.data.status === 500) {
    //   return Promise.reject(response);
    // }
  },
  error => {
    const code = error.request ? String(error.request.status) : null;
    if (code) {
      error.errorCode = 0; // 请求失败
      error.status = Number(code);
      switch (code.substr(0, 1)) {
        case '0':
          error.desc = '网络异常，请检查网络链接(0)'; // Network Error
          break;
        case '3':
          error.desc = '您尚未登录，请登录后重试(0)';
          break;
        case '4':
          error.desc = '请求出错,请稍后重试(0)'; // 4xx
          break;
        case '5':
          error.desc = '服务器出错,请稍后重试(0)'; // 5xx
          break;
        default:
          error.desc = '未知错误(0)';
          break;
      }
    }
    return Promise.reject(error);
  }
);

// 导出post和get请求方法
const POST = function(url, params, config) {
  let responseData;
  if (params instanceof FormData) {
    responseData = params;
    url = `${url}&subtime=${Date.now()}`;
    // responseData.append('subtime', Date.now());
  } else {
    responseData = qs.stringify(params) + '&subtime=' + Date.now();
  }
  return service.post(url, responseData, config);
};

const GET = function(url, params, config) {
  Object.assign(params, { subtime: Date.now() });
  return service.get(url, {
    params,
    ...config
  });
};

export default function(apiConfig, requestParams = {}, extraParams = {}) {
  const { method, url } = apiConfig;
  const sid = cookie.get('sid');
  const cc = sessionStorage.getItem('channel'); // 渠道,传才会赋值
  // header 拓展
  const currentHeaders = {
    ...(extraParams.headers || {}),
    ...(sid ? { sid } : {}),
    ...(cc ? { cc } : {})
  };
  switch (method.toUpperCase()) {
    case 'POST':
      return POST(url, requestParams, { ...extraParams, withCredentials: true, headers: currentHeaders });
    case 'GET':
      return GET(url, requestParams, { ...extraParams, withCredentials: true, headers: currentHeaders });
    default:
      return Promise.resolve({
        status: '500',
        desc: `没有找到method,报错位置:request/commonRequest/axiosRequest apiConfig:${JSON.stringify(apiConfig)}`,
        result: {}
      });
  }
};