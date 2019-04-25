import { SHOW_TOAST } from './enum/actionsEnum';
import { OPEN_TOAST_STATE } from './enum/mutationsEnum';

export default {
  [SHOW_TOAST]: {
    root: true,
    handler({ commit }, { text = '服务器开小差,请稍后重试', duration = 3000 } = {}) {
      // exceptRepeat = false 触发重复的toast内容，不延长时间
      // isCover=true 直接覆盖进行中的toast
      // order=1 权重级
      commit(OPEN_TOAST_STATE, { text, duration });
    }
  }
};