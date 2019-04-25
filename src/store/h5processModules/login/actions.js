import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';
import { API_LOGIN } from '@/api/h5Config/loginConfig';
import { LOGIN, EXIT_LOGIN_IN, JUMP_TO_LOGIN_ROUTER } from './enum/action-types';
import { SHOW_TOAST } from '@/store/commonModules/Toast/enum/actionsEnum';
// import { SUBMIT_BASE_INFO } from '@/store/commonModules/Reference/enum/mutationsEnum';
// import { GET_PROCESS_INFO } from '@/store/h5processModules/redirect/enum/action-types';
import vueRouter from '@/pages/h5process/router';

export default {
  async [LOGIN]({ commit, dispatch }, params = {}) {
    const { isLoading = true, isToast = false } = params;
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_LOGIN,
        config: { isLoading, isToast },
        params: { ...params },
        extraFetchConfig: {}
      }, { root: true });
      return data;
    } catch (e) {
      if (e && e.response && e.response.data) {
        if (e.response.data.status !== 203 && e.response.data.status !== 401) {
          dispatch(SHOW_TOAST, {
            text: e.response.data.desc || e.response.data.result || '服务器开小差,请稍后重试'
          });
        }
        return e.response.data;
      } else {
        dispatch(SHOW_TOAST, {
          text: '服务器开小差,请稍后重试'
        });
      }
    }
  },
  // 退出登录
  [EXIT_LOGIN_IN]({ dispatch }) {
    // 清除登录数据
    dispatch('Reference/clearLoginInfo', null, { root: true });
  },
  // 跳转登录页
  [JUMP_TO_LOGIN_ROUTER]({ dispatch }) {
    dispatch('exitLoginIn'); // 退出登录
    // 清除登录数据
    vueRouter.replace({ name: 'Login' }); // 跳转到登录页
  }
};