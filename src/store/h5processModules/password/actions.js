import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';
import { API_RESET_PWD } from "@/api/h5Config/pwdConfig";
import { RESET_PWD } from './enum/action-types';
import { SHOW_TOAST } from '@/store/commonModules/Toast/enum/actionsEnum';

export default {
  async [RESET_PWD]({ commit, dispatch }, params, { isLoading = true, isToast = true } = {}) {
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_RESET_PWD,
        config: { isLoading, isToast },
        params: { ...params },
        extraFetchConfig: {}
      }, { root: true });
      dispatch(SHOW_TOAST, { text: data.result });
      return data;
    } catch (e) {

      console.log(e);
      return e.response.data;
    }
  }
};
