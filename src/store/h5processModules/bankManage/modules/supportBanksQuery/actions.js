import { requireApiConfig } from '@/api/h5Config';
import { GET_SUPPORT_BANKS } from './enum/action-types';
import { COMMIT_SUPPORT_BANKS } from './enum/mutation-types';

export default {
  // 获取当前银行卡(页面初始化)
  async [GET_SUPPORT_BANKS]({ dispatch, commit, state }) {
    let supportedBanks = state.supportedBanks;
    if (supportedBanks) {
      return supportedBanks;
    }
    const response = await dispatch('fetchServer', {
      apiName: requireApiConfig('bankManage/API_QUERY_BANK_SUPPORT_LIST'),
      params: {
        channel: 2
      }
    }, { root: true });
    supportedBanks = response.result || [];
    commit(COMMIT_SUPPORT_BANKS, { supportedBanks });
    return supportedBanks;
  }
};