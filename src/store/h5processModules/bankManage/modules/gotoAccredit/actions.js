import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';
import { SHOW_TOAST } from '@/store/commonModules/Toast/enum/actionsEnum';

import {
  API_TO_GRANT_AUTHORIZATION
} from '@/api/h5Config/bankManage';

import {
  TO_GRANT_AUTHORIZATION
} from './enum/actionsEnum';

import {
  SET_GRANT_AUTHORIZATION
} from './enum/mutationsEnum';

export default {
  async [TO_GRANT_AUTHORIZATION]({ commit, dispatch }, options, { isLoading = false, isToast = false } = {}) {
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_TO_GRANT_AUTHORIZATION,
        config: { isLoading, isToast },
        params: options,
        extraFetchConfig: {}
      }, { root: true });
      commit(SET_GRANT_AUTHORIZATION, data.result);
    } catch (e) {
      dispatch(SHOW_TOAST, {
        text: e.msg || e.message || '获取调用跳转授权地址失败'
      }, { root: true });
    }
  }
};