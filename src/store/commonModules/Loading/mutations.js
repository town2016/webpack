import {
  ADD_ONCE_LOADING,
  DEL_ONCE_LOADING
} from './enum/mutationsEnum'

export default {
  [ADD_ONCE_LOADING](state) {
    state.loadCount++;
  },
  [DEL_ONCE_LOADING](state) {
    state.loadCount = state.loadCount <= 1 ? 0 : state.loadCount - 1;
  }
}