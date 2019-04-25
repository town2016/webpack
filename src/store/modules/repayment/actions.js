import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';
// import { requireApiConfig } from '@/api/config';

import { SUBMIT_STATE_DATA, RECOVER_WHIOLE_DATA } from './enum/mutation-types';
import { recoverWholeData, queryPreferredBankCard } from './enum/action-types';

// const bankInfoApi = function() {
//   return {
//     apiName: requireApiConfig('repayConfig/QUERYPREFERREDBANKCARD'),
//     config: { isLoading: true, isToast: true },
//     // params: { oId, productCode: 'iqiyi' },
//   };
// };

export default {
  async [queryPreferredBankCard]({ dispatch, commit, state }) {
    let bankInfo = state.banInfo;
    if (!bankInfo) {
      const bankResponse = await dispatch(FETCH_SERVER, {
        apiName: 'repayConfig/QUERYPREFERREDBANKCARD'
      }, { root: true });
      bankInfo = bankResponse.result;
      commit(SUBMIT_STATE_DATA, { bankInfo });
    }
    return bankInfo;
  },
  [recoverWholeData]({ commit }) {
    commit(RECOVER_WHIOLE_DATA);
  }
};
