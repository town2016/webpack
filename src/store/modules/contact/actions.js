import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum'
import { SHOW_TOAST } from '@/store/commonModules/Toast/enum/actionsEnum'
import { 
  API_GET_AQIYI_CONTACT_LIST,
} from '@/api/config/contactConfig'
import {
  GET_CONTACT_LIST
} from '@/store/modules/contact/enum/actionsEnum'
import { 
  SET_CONTACT_LIST
} from '@/store/modules/contact/enum/mutationsEnum'


export default {
  // 获取协议列表pdf
  async [GET_CONTACT_LIST]({commit, dispatch}, options, { isLoading = true, isToast = false } = {}) { 
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_GET_AQIYI_CONTACT_LIST,
        config: { isLoading, isToast },
        params: options,
        extraFetchConfig: {}
      }, { root: true });

      commit(SET_CONTACT_LIST, data.result);
    } catch(e) {
      dispatch(SHOW_TOAST, {
        text: e.desc || e.message || '获取协议列表失败，请稍后重试'
      })
    }
  },
}
