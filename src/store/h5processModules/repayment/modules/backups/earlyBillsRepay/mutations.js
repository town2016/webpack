import { _BILL_DETAIL_MANAGE, CLEAR_WHOLE_DATA, STATE_BECOME_FAIL } from './enum/mutation-types';

export default {
  // 处理还款订单列表
  [_BILL_DETAIL_MANAGE](state, payload) {
    console.log(payload);
    const earlyRepayFee = (payload.earlSettlement || 0) * 1; // 提前结清手续费
    const coustomCapital = (payload.shouldCapital || 0) * 1; // 应还本金
    const shouldInterest = (payload.shouldInterest || 0) * 1; // 应还利息
    const coustomTotal = (payload.shouldTotalAmt || 0) * 1; // 总计

    const shouldSubtraction = shouldInterest + coustomCapital + earlyRepayFee;
    const coustomManagerFee = (coustomTotal - shouldSubtraction).toFixed(2); // 管理费
    state.shouldRepayArr = [{
      title: '提前结清',
      type: 1, // 提前结清
      overdueInterest: 0,
      shouldInterest, // 应还利息
      earlyRepayFee, // 提前结清手续费
      coustomCapital, // 应还本金
      coustomManagerFee, // 管理费
      coustomTotal, // 总计
      contractNo: payload.contractNo,
      terms: payload.terms
    }];
    state.shouldRepayArr.isNotPrePay = true; // 非前置费
  },
  // 还原模块数据
  [CLEAR_WHOLE_DATA](_state) {
    _state.shouldRepayArr = null;
    console.log(_state.shouldRepayArr);
  },
  // 将状态致为失败
  [STATE_BECOME_FAIL](_state) {
    _state.shouldRepayArr = false;
  }
};