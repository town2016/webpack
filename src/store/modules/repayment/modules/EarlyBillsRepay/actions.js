import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';
import { _BILL_DETAIL_MANAGE, STATE_BECOME_FAIL, CLEAR_WHOLE_DATA } from './enum/mutation-types';
import { GET_CREDIT_BILL_DETAIL } from './enum/action-types';

// 还款账单列表
export default {
  async [GET_CREDIT_BILL_DETAIL]({ commit, dispatch }, { order }) {
    try {
      commit(CLEAR_WHOLE_DATA); // 清除详情数据 -> 进入加载中状态

      // 获取提前结清账单 carOwnerSettlementInfo
      const resonse = await dispatch(FETCH_SERVER, {
        apiName: 'repayConfig/GETEARLYALLREPAYINFO',
        config: { isLoading: true, isToast: true },
        params: {
          oId: order
        }
      }, { root: true });
      commit(_BILL_DETAIL_MANAGE, resonse.result);
    } catch (err) {
      commit(STATE_BECOME_FAIL); // 发生错误
      throw err;
    }
  }
};
