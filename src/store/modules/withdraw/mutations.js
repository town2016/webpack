import {
  QUERY_WITHDRAW_DEPOSIT_INFO_SUCCESS,
  QUERY_WITHDRAW_DEPOSIT_INFO_FAILD
} from "./enum/mutationsEnum";

export default {
  [QUERY_WITHDRAW_DEPOSIT_INFO_SUCCESS](state,payload) {
    state.drawDepositInfo = Object.assign({},state.drawDepositInfo, payload);
  },
  [QUERY_WITHDRAW_DEPOSIT_INFO_FAILD](state) {
    state.drawDepositInfo = Object.assign({}, state.drawDepositInfo, {});
  }
};
