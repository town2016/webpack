import mutations from './mutations';
import actions from './actions';
// 还款账单列表
export default {
  namespaced: true, // OrderPay
  state: {
    bankArr: null,
    selectIndex: 0
  },
  getters: {
    bankInfo(state) {
      const bankArr = state.bankArr;
      const selectIndex = state.selectIndex;
      if (!Array.isArray(bankArr)) {
        return null;
      }
      return bankArr[selectIndex];
    },
    isNeedAgree: (state, getters) => (getters.bankInfo ? getters.bankInfo.isNeedAgree : null)
  },
  actions,
  mutations
};