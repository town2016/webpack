import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';
import { API_GET_CONFIG } from '@/api/h5Config/basicConfig';
import { GET_CONFIG } from './enum/action-types';
import { SHOW_TOAST } from '@/store/commonModules/Toast/enum/actionsEnum';

export default {
  async [GET_CONFIG]({commit, dispatch}, params, {isLoading = false, isToast = true} = {}) {
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_GET_CONFIG,
        config: {isLoading, isToast},
        params: {...params},
        extraFetchConfig: {}
      }, {root: true});
      if(data.status == 200){
        localStorage.setItem('channelPermission',JSON.stringify(data.result.channelPermission) || '[]');
        return data.result;
      }else{
        return null;
      }
    } catch (e) {
      console.log(e);
      return Promise.reject(e)
    }
  }
};
