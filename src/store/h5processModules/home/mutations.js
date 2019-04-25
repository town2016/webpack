import {
  SET_HOME_INFO,
  SET_LIMIT_INFO,
  SET_LATEST_CREDIT_DEDUCT_RESULT
} from './enum/mutation-types'

export default {
  [SET_HOME_INFO]( state, info ) {
    state.homeInfo = info;
  },
  [SET_LIMIT_INFO]( state, info ) {
    state.limitInfo = info;
  },
  [SET_LATEST_CREDIT_DEDUCT_RESULT]( state, result ) {
    state.latestCreditDeductResult = result;
  }
}
