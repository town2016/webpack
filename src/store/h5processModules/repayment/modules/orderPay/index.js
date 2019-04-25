import mutations from './mutations';
import actions from './actions';
// 还款账单列表
export default {
  namespaced: true, // OrderPay
  state: {
    oId: null,
    bankName: null,
    cardNo: null,
    moneyTotal: '0.00',
    phaseTotal: 0,
    type: 'normal', // 正常还款 或 提前结清
    isPrePayFee: null,
    phasesStr: null // 提前结清会提供
  },
  getters: {
    cardNo: (state) => state.cardNo,
    bankName: (state) => state.bankName,
    moneyTotal: (state) => state.moneyTotal,
    phaseTotal: (state) => state.phaseTotal,
    isPrePayFee: (state) => state.isPrePayFee
  },
  actions,
  mutations
};