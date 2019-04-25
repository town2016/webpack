import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';
import { requireApiConfig } from '@/api/h5Config';
import { GET_BANK_INFO } from './enum/action-types';

export default {
  // 查询银行卡
  async [GET_BANK_INFO]({ dispatch }) {
    const response = await dispatch(FETCH_SERVER, {
      apiName: requireApiConfig('bankManage/API_QUERY_BANK_INFO')
    }, { root: true });
    return response.result;
  }
};