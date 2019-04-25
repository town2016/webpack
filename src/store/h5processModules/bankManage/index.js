import userBankAdd from './modules/userBankAdd';
import gotoAccredit from './modules/gotoAccredit';
import supportBanksQuery from './modules/supportBanksQuery';

import actions from './actions';

export default {
  namespaced: true,
  modules: {
    userBankAdd,
    gotoAccredit,
    supportBanksQuery
  },
  actions
};