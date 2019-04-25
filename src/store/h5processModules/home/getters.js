import {
  HOME_INFO,
  LIMIT_INFO,
  LATEST_CREDIT_DEDUCT_RESULT
} from "./enum/getter-types";

export default {
  [HOME_INFO](state) {
    return state.homeInfo;
  },
  [LIMIT_INFO](state) {
    return state.limitInfo;
  },
  [LATEST_CREDIT_DEDUCT_RESULT](state) {
    return state.latestCreditDeductResult;
  }
}
