import serviceFactory from '@/api/factory';

import { ACTIONS_BEGIN_LOADING, ACTIONS_FINISH_LOADING } from '@/store/commonModules/Loading/enum/actionsEnum';

import { ACTIONS_ERROR } from '@/store/commonModules/Error/enum/actionsEnum';
import { requireApiConfig } from '@/api/config/index';
import { FETCH_SERVER } from './enum/actionEnum';

export default {
  async [FETCH_SERVER]({ commit, dispatch }, { apiName, params = {}, config = {}, extraFetchConfig = {} }) {
    if (!apiName) {
      throw new Error('No required property(apiName) found!');
    } else if (typeof apiName === 'string') {
      apiName = requireApiConfig(apiName);
    }
    // isLoading 是否需要菊花
    // isToast 是否需要错误弹窗
    const { isLoading = true, isToast = true, costomToast = false } = config;
    let error;
    let backData;

    // 弹出loading
    await dispatch(ACTIONS_BEGIN_LOADING, { isLoading }, { root: true });
    try {
      // 请求
      const response = await serviceFactory.request(apiName, params, extraFetchConfig);
      backData = response.data;
      if (!backData) { // 后端返回response为空
        const errBody = new Error('expect response exist,but it empty');
        errBody.desc = '请求出错,请稍后重试';
        errBody.errorCode = 1; // 后端返回response为空
        throw errBody;
      }
      const { status, code, desc, msg } = backData;
      let responseCode = status || code;
      if (!responseCode) { // 后端未返回status
        const errBody = new Error('No found status obtained');
        errBody.response = response;
        errBody.errorCode = 3; // 后端未返回status
        errBody.desc = desc || msg;
        throw errBody;
      }
      if (Number(responseCode) !== 200) { // 后端返回status不为200或302或203
        const errBody = new Error(`status not equel 200,but ${responseCode}`);
        errBody.response = response;
        errBody.status = Number(responseCode);
        errBody.errorCode = 2; // 后端返回status不为200
        errBody.desc = desc || msg;
        // error = { errorBody: response, desc, msg: };
        throw errBody;
      }
    } catch (err) {
      error = err;
    }

    // 关闭loading
    dispatch(ACTIONS_FINISH_LOADING, { isLoading }, { root: true });

    // 有错误就抛出错误
    if (error) {
      dispatch(ACTIONS_ERROR, { errorInfo: error, isToast, costomToast }, { root: true });
      throw error;
    }

    return backData;
  }
};