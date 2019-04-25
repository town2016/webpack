import { OPEN_TOAST_STATE } from './enum/mutationsEnum';
import actions from './actions';

export default {
  namespaced: true,
  state: {
    toastInfo: null
  },
  getters: {
    toastInfo: state => state.toastInfo
  },
  actions,
  mutations: {
    [OPEN_TOAST_STATE](state, payload) {
      // exceptRepeat = false 触发重复的toast内容，不延长时间
      // isCover=true 直接覆盖进行中的toast
      // order=1 权重级
      state.toastInfo = payload;
    }
  }
};
