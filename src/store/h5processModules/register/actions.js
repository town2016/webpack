import {FETCH_SERVER} from '@/store/commonModules/Service/enum/actionEnum';
import {SHOW_TOAST} from '@/store/commonModules/Toast/enum/actionsEnum';
import {API_REGISTER} from '@/api/h5Config/registerConfig';
import {REGISTER} from './enum/action-types';
import router from '@/pages/h5process/router';

export default {
  /**
   * 全流程注册
   */
  async [REGISTER]({commit, dispatch}, {isToast = false, isLoading = true, ...options} = {}) {
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_REGISTER,
        config: {isToast, isLoading},
        params: options,
        extraFetchConfig: {}
      }, {root: true});
      return data;
    } catch (e) {
      console.log(e);
      if(e && e.response && e.response.data){
        if(e.response.data.status !== 203 && e.response.data.status !== 401){
          dispatch(SHOW_TOAST,{
            text: e.response.data.desc||e.response.data.result || '服务器开小差,请稍后重试'
          })
        }
        return e.response.data;
      }else{
        dispatch(SHOW_TOAST,{
          text: '服务器开小差,请稍后重试'
        })
      }
    }
  }
};
