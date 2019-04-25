// import BillsListQuery from './BillsListQuery';
import OrderPay from './modules/OrderPay';
import BillDetailOperate from './modules/BillDetailOperate';
import EarlyBillsRepay from './modules/EarlyBillsRepay';
import BillsListQuery from './modules/BillsListQuery';
import { SUBMIT_STATE_DATA, RECOVER_WHIOLE_DATA } from './enum/mutation-types';
import actions from './actions';

export default {
  namespaced: true,
  modules: {
    // BillsListQuery,
    OrderPay,
    BillDetailOperate,
    EarlyBillsRepay,
    BillsListQuery
  },
  state: {
    bankInfo: null
  },
  actions,
  mutations: {
    [SUBMIT_STATE_DATA](state, payload) {
      Object.assign(state, payload);
    },
    [RECOVER_WHIOLE_DATA](state, payload) {
      state.bankInfo = null;
    }
  }
};
