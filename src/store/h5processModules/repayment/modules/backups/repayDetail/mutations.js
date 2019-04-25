import { _BILL_DETAIL_MANAGE, CLEAR_WHOLE_DATA, STATE_BECOME_FAIL } from './enum/mutation-types';

/**
 * withholdStatus 代扣状态
 * 非前置费 ->  待代扣=0 代扣中=5 代扣成功=10 代扣失败=20 系统错误=50
 * 前置费 -> 1还款中；2失败；3成功；4作废；5取消；6部分成功
 */
// isPreFee->是否为前置费
const fiilterOrderData = function(arr, isPreFee) {
  // 找到还款中，失败，成功则忽略此单，其他算待付款
  const statusMap = isPreFee ? [
    [1], // 付款中
    [2, 4, 5, 6], // 失败
    [3] // 成功
  ] : [
    [5], // 付款中
    [20, 50], // 失败
    [10] // 成功
  ];

  const returnArr = [];
  arr.forEach((x) => {
    let isIgnore = false;
    if (~statusMap[0].indexOf(x.withholdStatus * 1)) {
      x.customStatus = 0;
      x.isDoing = true;
      x.customDesc = '正在划扣中';
    } else if (~statusMap[1].indexOf(x.withholdStatus * 1)) {
      x.customStatus = 1;
      x.customDesc = '划扣失败';
    } else if (~statusMap[2].indexOf(x.withholdStatus * 1)) {
      // x.customStatus = 2;
      // x.customDesc = '划扣成功';
      isIgnore = true; // 忽略此单，不显示
    } else { // 等待支付
      x.customStatus = 3;
      x.customDesc = '待支付';
    }
    (!isIgnore) && returnArr.push(x);
  });
  return returnArr;
};

export default {
  // 处理还款订单列表
  [_BILL_DETAIL_MANAGE](_state, _payload) {
    const { result } = _payload;
    const { loanData = null } = result;
    const shoulReturn = fiilterOrderData(result.shoulReturn, false); // 过滤非前置单

    if (loanData) {
      _state.repayDatailArr = fiilterOrderData([loanData], true); // 过滤前置单
      _state.shouldRepayArr.isNotPrePay = false;
    } else {
      shoulReturn.isNotPrePay = true; // 非前置费
      shoulReturn.forEach((x) => {
        const overdueInterest = x.overdueInterest * 1;
        const shouldInterest = x.shouldInterest * 1;
        const coustomInterest = overdueInterest + shouldInterest;
        const coustomCapital = x.shouldRepayAmt * 1;
        const coustomTotal = x.shouldTotal * 1;
        const coustomManagerFee = coustomTotal - coustomInterest - coustomCapital;
        x.overdueInterest = overdueInterest.toFixed(2); // 逾期
        x.isOverdueBill = x.repayStatus === 2; // 是否为逾期账单

        x.shouldInterest = shouldInterest.toFixed(2); // 应还
        // x.coustomInterest = coustomInterest.toFixed(2); // 利息
        x.coustomCapital = coustomCapital.toFixed(2); // 本金
        x.coustomManagerFee = coustomManagerFee.toFixed(2); // 管理费
        x.coustomTotal = coustomTotal.toFixed(2); // 总共
      });
      _state.repayDatailArr = shoulReturn;
    }
  },
  // 还原模块数据
  [CLEAR_WHOLE_DATA](_state, _payload) {
    _state.repayDatailArr = null;
  },
  // 将状态致为失败
  [STATE_BECOME_FAIL](_state, _payload) {
    _state.repayDatailArrArr = false;
  }
};