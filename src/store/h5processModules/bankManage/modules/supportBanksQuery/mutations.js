import { COMMIT_SUPPORT_BANKS } from './enum/mutation-types';

export default {
  [COMMIT_SUPPORT_BANKS](state, { supportedBanks }) {
    state.supportedBanks = supportedBanks;
  }
};