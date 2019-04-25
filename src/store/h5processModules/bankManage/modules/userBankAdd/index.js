import actions from './actions';
import mutations from './mutations';
import { BANK_INFO, NOT_SUPPORT_BANK } from './enum/getter-types';

export default {
  namespaced: true,
  state: {
    bankInfo: null,
    notSupportBank: false
  },
  getters: {
    [BANK_INFO]: (state) => state.bankInfo,
    // 是否不支持
    [NOT_SUPPORT_BANK]: (state) => state.notSupportBank
  },
  actions,
  mutations
};