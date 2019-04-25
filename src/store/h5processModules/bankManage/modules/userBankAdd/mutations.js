import { COMMIT_BANK_INFO } from './enum/mutation-types';

export default {
  [COMMIT_BANK_INFO](state, { bankInfo, notSupportBank }) {
    state.bankInfo = bankInfo;
    state.notSupportBank = notSupportBank;
  }
};