import {
  QUERY_EVALUATE_LIMIT_INFO_SUCCESS,
  QUERY_EVALUATE_LIMIT_INFO_FAILD
} from "./enum/mutationsEnum";

export default {
  [QUERY_EVALUATE_LIMIT_INFO_SUCCESS](state,payload) {
    state.evaluateLimitInfo = Object.assign({},state.evaluateLimitInfo, payload);
  },
  [QUERY_EVALUATE_LIMIT_INFO_FAILD](state) {
    state.evaluateLimitInfo = Object.assign({}, state.evaluateLimitInfo, {});
  }
};
