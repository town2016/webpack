import actions from './actions.js';
import mutations from './mutations.js';
// getters
import { BILLS_ORDER, REPAY_TOTAL } from './enum/getter-types';

// 还款账单列表
export default {
  namespaced: true,
  state: {
    billsOrder: null,
    repayTotal: '0.00'
  },
  getters: {
    [BILLS_ORDER]: (state) => state.billsOrder,
    [REPAY_TOTAL]: (state) => state.repayTotal
  },
  actions,
  mutations
};
