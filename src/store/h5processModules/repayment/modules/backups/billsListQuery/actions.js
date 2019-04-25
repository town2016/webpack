// action
import { GET_CREDIT_ORDER_LIST } from './enum/action-types';

// mutation
import { HANDLE_CREDIT_ORDER_LIST } from './enum/mutation-types';

export default {
  async [GET_CREDIT_ORDER_LIST]({ commit }) {
    // 提交列表数据
    commit(HANDLE_CREDIT_ORDER_LIST, {});
    // return Api.repay.getCreditOrderList().next((res) => {
    //   commit(types._CREDIT_ORDER_LIST_HANDLE, res);
    //   // commit('BillsListQuery/'+types.CREDIT_ORDER_LIST_HANDLE, res, { root: true });
    // });
  }
};
