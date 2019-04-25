import actions from './actions';
import mutations from './mutations';
import { SUPPORTED_BANKS } from './enum/getter-types';

export default {
  namespaced: true,
  state: {
    supportedBanks: null
  },
  getters: {
    // 支持银行卡列表
    [SUPPORTED_BANKS]: (state) => state.supportedBanks
  },
  actions,
  mutations
};