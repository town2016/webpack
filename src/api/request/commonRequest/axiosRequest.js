import Axios from "axios";
import qs from "qs";

let secCatalog = '';
switch(process.env.BUILD_ENV) {
  case 'prd':
  case 'release':
    secCatalog = '/';
    break;
  default:
    secCatalog = '/iqiyi_api/';
}

// 创建Axios实例
const service = Axios.create({
  // baseURL: process.env.NODE_ENV === "development" ? "/api_service/" : "/iqiyi_api/" // api的base_url
  baseURL: process.env.NODE_ENV === "development" ? "/api_service/" : `${secCatalog}` // api的base_url
  // timeout: 60000,  // 请求超时时间
  // headers: { cc: '102' },
});

// 拦截每一次请求, 在请求发送之前做一些操作
service.interceptors.request.use(
  async config => {
      // 添加subTime
      if (config.method === "get") {
        Object.assign(config.params, { subtime: Date.now() });
      } else {
        config.data = config.data + "&subtime=" + Date.now();
      }
      return config;
    },
    error => Promise.reject(error)
);

// 拦截每一次请求返回结果，并对结果进行处理
service.interceptors.response.use(
  // 获取后台返回的json数据
  response => response,
  error => {
    const code = error.request ? String(error.request.status) : null;
    if (code) {
      error.errorCode = 0; // 请求失败
      error.status = Number(code);
      switch (code.substr(0, 1)) {
        case '0':
          error.desc = '网络异常，请检查网络链接(0)'; // Network Error
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
  return service.post(url, qs.stringify(params), config);
};

const GET = function(url, params, config) {
  return service.get(url, {
    params,
    ...config,
  });
};

export default function(apiConfig, requestParams = {}, extraParams = {}) {
  const { method, url } = apiConfig;
  switch (method.toUpperCase()) {
    case 'POST':
      return POST(url, requestParams, { ...extraParams, withCredentials: true });
    case 'GET':
      return GET(url, requestParams, { ...extraParams, withCredentials: true });
    default:
      return Promise.resolve({
        status: '500',
        desc: `没有找到method,报错位置:request/commonRequest/axiosRequest apiConfig:${JSON.stringify(apiConfig)}`,
        result: {},
      });
  }
}