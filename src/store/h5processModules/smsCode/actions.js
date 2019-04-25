import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';
import { SHOW_TOAST } from '@/store/commonModules/Toast/enum/actionsEnum';
import { MessageBox } from "mint-ui";
import router from '@/pages/h5process/router';

import {
  API_SEND_SMS_CODE,
  API_GET_CAPTCHA_JS_URL,
  API_CHECK_SMS_CODE
} from '@/api/h5Config/basicConfig';
import {
  SEND_SMS_CODE,
  GET_CAPTCHA_JS_URL,
  CHECK_SMS_CODE
} from './enum/action-types';
import {
  SET_SMS_CODE_STATUS,
  SET_CAPTCHA_JS_URL,
  SET_CHECK_SMS_CODE_TOKEN
} from './enum/mutation-types';

export default {
  async [SEND_SMS_CODE]({ commit, dispatch }, { isToast = false, isLoading = true, ...options } = {}) {
    try {
      let data = await dispatch(FETCH_SERVER, {
        apiName: API_SEND_SMS_CODE,
        config: { isToast, isLoading },
        params: options
      }, { root: true });
      commit(SET_SMS_CODE_STATUS, data);
    } catch (e) {
      if(e.status == 203){
        commit(SET_SMS_CODE_STATUS, e.response.data);
      }else{
        commit(SET_SMS_CODE_STATUS, e.response.data || e.data || {});
        if(e.response && e.response.data && e.response.data.desc.indexOf('已注册')> -1){
          MessageBox.confirm('', {
            message: '该手机号已注册, 请直接登录',
            title: '提示',
            confirmButtonText: '去登录',
            cancelButtonText: '取消'
          }).then(action => {
            if (action == 'confirm') { //确认的回调,跳转认证
              router.push({path: '/login'});
            }
          }).catch(e=>{});
        }else{
          dispatch(SHOW_TOAST, {
            text: e.desc || '系统繁忙，请稍后重试...'
          });
        }
      }
    }
  },
  async [GET_CAPTCHA_JS_URL]({ commit, dispatch }, { isToast = true, isLoading = true, ...options } = {}) {
    try {
      let data = await dispatch(FETCH_SERVER, {
        apiName: API_GET_CAPTCHA_JS_URL,
        config: { isToast, isLoading },
        params: options
      }, { root: true });
      commit(SET_CAPTCHA_JS_URL, data);
    } catch (e) {
      console.log(e);
    }
  },
  async [CHECK_SMS_CODE]({ commit, dispatch }, { isToast = true, isLoading = true, ...options } = {}) {
    commit(SET_CHECK_SMS_CODE_TOKEN, '');
    try {
      let data = await dispatch(FETCH_SERVER, {
        apiName: API_CHECK_SMS_CODE,
        config: { isToast, isLoading },
        params: options
      }, { root: true });
      if(data.result == '短信验证码错误,请重新输入'){
        dispatch(SHOW_TOAST, { text: '短信验证码错误' });
        return;
      }
      commit(SET_CHECK_SMS_CODE_TOKEN, data.result);
    } catch (e) {
      console.log(e);
    }
  },
};
