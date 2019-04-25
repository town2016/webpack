import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';
import { API_PHONE_AUTH , API_RESET_SERVICE_PASSWORD} from '@/api/h5Config/authentication';
import { API_GET_LOGIN_PHONE } from "@/api/h5Config/userConfig";
import { GET_LOGIN_PHONE, PHONE_AUTH, RESET_SERVICE_PASSWORD } from './enum/action-types';
import { SET_LOGIN_PHONE, SET_PHONE_AUTH_INFO } from './enum/mutation-types';

export default {
  async [GET_LOGIN_PHONE]({ commit, dispatch }, params, { isLoading = true, isToast = true } = {}) {
    commit(SET_LOGIN_PHONE, null);
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_GET_LOGIN_PHONE,
        config: { isLoading, isToast },
        params: { ...params },
        extraFetchConfig: {}
      }, { root: true });
      commit(SET_LOGIN_PHONE, data.result);
    } catch (e) {
      console.log(e);
    }
  },
  async [PHONE_AUTH]({ commit, dispatch }, params, { isLoading = true, isToast = false } = {}) {
    commit(SET_PHONE_AUTH_INFO, null);
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_PHONE_AUTH,
        config: { isLoading, isToast },
        params: { ...params },
        extraFetchConfig: {}
      }, { root: true });
      if(data.status == 200){
        commit(SET_PHONE_AUTH_INFO, data);
      }
      return data;
    } catch (e) {
      console.log(e);
      if(e.response.data){
        commit(SET_PHONE_AUTH_INFO, e.response.data);
      }
      return e.response.data;
    }
  },
  async [RESET_SERVICE_PASSWORD]({ commit, dispatch }, params, { isLoading = true, isToast = true } = {}) {
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_RESET_SERVICE_PASSWORD,
        config: { isLoading, isToast },
        params: { ...params },
        extraFetchConfig: {}
      }, { root: true });
      return data;
    } catch (e) {
      console.log(e);
      return e.response.data;
    }
  }
};
