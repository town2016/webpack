import { ACTIONS_ERROR } from './enum/actionsEnum';
import { ERROR_MESSAGE, ERROR_ADDINFO } from './enum/mutationsEnum';
import { SHOW_TOAST } from '@/store/commonModules/Toast/enum/actionsEnum';

export default {
  [ACTIONS_ERROR]({ commit, dispatch }, params = {}) {
    const { isToast = true, errorInfo = {}, costomToast } = params;
    const { desc, errorCode, status } = errorInfo;
    let msg = null;
    let needRecordError = true;
    // errorCode===0 为前端框架内部错误信息

    if (errorCode === 2) { // 后端返回不为200
      if (status === 302) {
        msg = '未登录,请先登录';
        // 登录并清除登录数据
        dispatch('login/jumpToLoginRouter', null, { root: true });
      }
    }

    // 记录错误信息
    if (needRecordError) {
      commit(ERROR_ADDINFO, errorInfo);
      commit(ERROR_MESSAGE, errorInfo);
    }

    // 是否弹窗
    // isToast && commit(ERROR_MESSAGE, { errorMessage, errorBody })
    let toastText = isToast ? costomToast ? errorCode === 0 ? desc : '' : msg || desc || '服务器开小差,请稍后重试' : '';

    if (toastText) {
      dispatch(SHOW_TOAST, {
        text: toastText
      });
    }
  }
};