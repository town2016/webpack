import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum'
import { SHOW_TOAST } from '@/store/commonModules/Toast/enum/actionsEnum'
import { 
  API_GET_FIRST_REPAY_CARD,
  API_QUERY_BANK_SUPPORT_LIST,
  API_GET_PAY_TYPE,
  API_GET_SMS_CODE,
  API_THIRD_QUERY_BIND,
  API_BIND_BANK_CARD,
  API_GET_CARD_AGREEMENT
} from '@/api/config/bankCardConfig'
import { 
  GET_FIRST_REPAY_CARD,
  QUERY_BANK_SUPPORT_LIST,
  GET_PAY_TYPE,
  BIND_BANK_CARD,
  GET_SMS_CODE,
  THIRD_QUERY_BIND,
  GET_CARD_AGREEMENT
} from '@/store/modules/bankCard/enum/actionsEnum'
import { 
  SET_BANK_CARD,
  SET_BANK_SUPPORT_LIST,
  SET_PAY_TYPE,
  SET_BIND_CARD_CALLBACK_URL,
  SET_IS_THIRD_BIND,
  SET_SMS_CODE_SUCCESS,
  SET_CARD_AGREEMENT
} from '@/store/modules/bankCard/enum/mutationsEnum'

export default {
  // 获取首张银行卡
  async [GET_FIRST_REPAY_CARD]({commit, dispatch}, {isLoading = true,isToast = false} = {}) { 
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_GET_FIRST_REPAY_CARD,
        config: { isLoading, isToast },
        params: {},
        extraFetchConfig: {}
      }, { root: true });
      
      commit(SET_BANK_CARD, data)
    } catch(e) {
      dispatch(SHOW_TOAST, {
        text: e.desc || e.message || '获取默认银行卡失败，请稍后重试'
      })
    }
  },
  // 获取支持银行的接口
  async [QUERY_BANK_SUPPORT_LIST]({commit, dispatch}, { channel = 2, isLoading = true, isToast = false} = {}) { 
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_QUERY_BANK_SUPPORT_LIST,
        config: { isLoading, isToast },
        params: { channel },
        extraFetchConfig: {}
      }, { root: true });

      commit(SET_BANK_SUPPORT_LIST, data);
    } catch(e) {
      dispatch(SHOW_TOAST, {
        text: e.desc || e.message || '获取支持银行列表失败，请稍后重试'
      })
    }
  },
  // 获取支付开关
  async [GET_PAY_TYPE]({commit, dispatch}, { isLoading = false, isToast = false } = {}) { 
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_GET_PAY_TYPE,
        config: { isLoading, isToast },
        params: {},
        extraFetchConfig: {}
      }, { root: true });

      commit(SET_PAY_TYPE, data);
    } catch(e) {
      dispatch(SHOW_TOAST, {
        text: e.desc || '获取支付类型失败，请稍后重试'
      })
    }
  },
  // 获取短信验证码
  async [GET_SMS_CODE]({commit, dispatch}, params, { isLoading = true, isToast = false } = {}) { 
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_GET_SMS_CODE,
        config: { isLoading, isToast },
        params: { ...params },
        extraFetchConfig: {}
      }, { root: true });

      commit(SET_SMS_CODE_SUCCESS, true);
    } catch(e) {
      dispatch(SHOW_TOAST, {
        text: e.desc || '获取验证码失败，请稍后重试'
      })
    }
  },
  // 添加银行卡
  async [BIND_BANK_CARD]({commit, dispatch}, params, { isLoading = true, isToast = false } = {}) { 
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_BIND_BANK_CARD,
        config: { isLoading, isToast },
        params: { ...params },
        extraFetchConfig: {}
      }, { root: true });

      const { 
        isBind,
        confirmBindCardCallBackUrl, // 天创url
        url // 广发绑卡页url
      } = data.result;

      let text = '';
      let gotoUrl = '';
      // isBind判断是否绑定过广发，已绑定，就跳天创，否则跳广发绑卡页
      if(isBind) { 
        text = '您已成功绑定，3秒后跳转...'
        gotoUrl = confirmBindCardCallBackUrl;
      } else {
        text = '银行卡存管绑定中，请稍后重试'
      }
      dispatch(SHOW_TOAST, {
        text: data.desc || text
      })
      commit(SET_BIND_CARD_CALLBACK_URL, gotoUrl);
    } catch(e) {
      dispatch(SHOW_TOAST, {
        text: e.desc || '提交失败，请稍后重试'
      })
    }
  },
  // 校验第三方绑卡
  async [THIRD_QUERY_BIND]({commit, dispatch}, params, { isLoading = true, isToast = false } = {}) { 
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_THIRD_QUERY_BIND,
        config: { isLoading, isToast },
        params: { ...params },
        extraFetchConfig: {}
      }, { root: true });
      commit(SET_IS_THIRD_BIND, data.result);
    } catch(e) {
      dispatch(SHOW_TOAST, {
        text: e.desc || '校验第三方绑卡失败'
      })
    }
  },
  // 获取绑卡协议url
  async [GET_CARD_AGREEMENT]({commit, dispatch}, { isLoading = true, isToast = false } = {}) { 
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_GET_CARD_AGREEMENT,
        config: { isLoading, isToast },
        params: {  },
        extraFetchConfig: {}
      }, { root: true });
      commit(SET_CARD_AGREEMENT, data.result.pdfSignUrl);
    } catch(e) {
      dispatch(SHOW_TOAST, {
        text: e.desc || '没有获取到绑卡协议链接'
      })
    }
  },
  
}