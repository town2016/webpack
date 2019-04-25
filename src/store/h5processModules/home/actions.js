import { FETCH_SERVER } from "@/store/commonModules/Service/enum/actionEnum";
import { SHOW_TOAST } from "@/store/commonModules/Toast/enum/actionsEnum";
import {
  API_HOME,
  API_GET_LIMIT_INFO,
  API_GET_LATEST_CREDIT_DEDUCT_RESULT
} from "@/api/h5Config/homeConfig";
import {
  GET_HOME_INFO,
  GET_LIMIT_INFO,
  GET_LATEST_CREDIT_DEDUCT_RESULT
} from "./enum/action-types";
import {
  SET_HOME_INFO,
  SET_LIMIT_INFO,
  SET_LATEST_CREDIT_DEDUCT_RESULT
} from "./enum/mutation-types";

export default {
  /**
   * 首页获取首页信息
   */
  async [GET_HOME_INFO]({ commit, dispatch }, params ,{ isLoading = false, isToast = true } = {}) {
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_HOME,
        config: { isLoading, isToast },
        params: params,
        extraFetchConfig: {}
      }, {root: true});

      if(data.desc == '没有订单信息'|| data.desc == '未找到账信息' || !!data.result){
        commit(SET_HOME_INFO, data.result || { isSettled: true });
        return;
      }
      commit(SET_HOME_INFO, data.result || {});
    }catch (e) {
      console.log(e)
    }
  },
  async [GET_LIMIT_INFO]({ commit, dispatch }, params, { isLoading = false, isToast = true } = {}) {
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_GET_LIMIT_INFO,
        config: { isLoading, isToast },
        params: { ...params },
        extraFetchConfig: {}
      }, { root: true });

      if(data.result){
        commit(SET_LIMIT_INFO, data.result);
      }
    } catch (e) {
      console.log(e);
    }
  },
  async [GET_LATEST_CREDIT_DEDUCT_RESULT]({ commit, dispatch }, params ,{ isLoading = false, isToast = true } = {}) {
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_GET_LATEST_CREDIT_DEDUCT_RESULT,
        config: { isLoading, isToast },
        params: params,
        extraFetchConfig: {}
      }, {root: true});

      if(data.result){
        commit(SET_LATEST_CREDIT_DEDUCT_RESULT, data.result);
      }
    }catch (e) {
      console.log(e)
    }
  },
}
