import { SUBMIT_CONFIRM_DATA, CLEAT_CONFIRM_DATA } from './enum/mutationsEnum';
import actions from './actions';

export default {
  namespaced: true,
  state: {
    confirmInfo: null,
  },
  getters: {
    confirmInfo: state => state.confirmInfo,
  },
  actions,
  mutations: {
    [SUBMIT_CONFIRM_DATA](state, payload) {
      // exceptRepeat = false
      state.confirmInfo = payload;
    },
    [CLEAT_CONFIRM_DATA](state) {
      state.confirmInfo = null;
    },
  },
};
