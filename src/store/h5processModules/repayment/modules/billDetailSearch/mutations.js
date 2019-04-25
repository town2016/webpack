import {
  SUBMIT_BILL_DETAIL_MANAGE,
  RESET_INITED_STATE,
  IN_LOADING,
  IN_LOADED_STATE
} from './enum/mutation-types';

/**
 * withholdStatus 代扣状态
 * 非前置费 ->  待代扣=0 代扣中=5 代扣成功=10 代扣失败=20 系统错误=50
 * 前置费 -> 1还款中；2失败；3成功；4作废；5取消；6部分成功
 */
// isPreFee->是否为前置费
// const fiilterOrderData = function(arr, isPreFee) {
//   // 找到还款中，失败，成功则忽略此单，其他算待付款
//   const statusMap = isPreFee ? [
//     [1], // 付款中
//     [2, 4, 5, 6], // 失败
//     [3] // 成功
//   ] : [
//     [5], // 付款中
//     [20, 50], // 失败
//     [10] // 成功
//   ];

//   const returnArr = [];
//   arr.forEach((x) => {
//     let isIgnore = false;
//     if (~statusMap[0].indexOf(x.withholdStatus * 1)) {
//       x.customStatus = 0;
//       x.isDoing = true;
//       x.customDesc = '正在划扣中';
//     } else if (~statusMap[1].indexOf(x.withholdStatus * 1)) {
//       x.customStatus = 1;
//       x.customDesc = '划扣失败';
//     } else if (~statusMap[2].indexOf(x.withholdStatus * 1)) {
//       // x.customStatus = 2;
//       // x.customDesc = '划扣成功';
//       isIgnore = true; // 忽略此单，不显示
//     } else { // 等待支付
//       x.customStatus = 3;
//       x.customDesc = '待支付';
//     }
//     (!isIgnore) && returnArr.push(x);
//   });
//   return returnArr;
// };

const toNumber = (str) => Number(str) || 0;
const toFixed = (num) => num.toFixed(2);
const resolveBills = (listData) => {
  let remainedTotal = 0; // 未出总金额
  let payableTotal = 0; // 可还总金额
  let isExistDoing = false; // 存在正在还款的
  const billsInfo = listData.reduce((target, item) => {
    // 后端返回逾期利息
    const overdueInterest = toNumber(item.ovdTotInterest); // ovdDueInterest
    // 后端返回应还利息
    const shouldInterest = toNumber(item.repayTotInterest); // repayDueInterest
    // 后端返回管理费
    const manageFee = toNumber(item.totMoney); // totAccountMgmtFee
    // 后端返回本金
    const capital = toNumber(item.repayTotCapital); // repayDueCapital
    // 提前结清金额
    const earlyRepayFee = toNumber(item.earlyPayFee);
    // 后端返回 -> 剩余应还总金额
    const shouldTotal = toNumber(item.shouldRepay);

    // 逾期利息
    item._overdueInterest = toFixed(overdueInterest);
    // 应还利息
    item._shouldInterest = toFixed(shouldInterest);
    // 管理费
    item._manageFee = toFixed(manageFee);
    // 本金
    item._capital = toFixed(capital);
    // 应还总金额
    item._shouldTotal = toFixed(shouldTotal);
    // 提前结清金额
    item._earlyRepayFee = toFixed(earlyRepayFee);
    // status
    const status = Number(item.status);
    // 日期（已还账单取实际还款的日期）
    try {
      item._date = item[status === 5 ? 'repayActTime' : 'repayDueTime'].split(' ')[0];
    } catch (err) {
      item._date = '0000-00-00';
    }

    // if (shouldTotal === 0) {
    //   console.error('发现出错的订单');
    //   // 过滤为0的错误订单
    //   return target;
    // }
    switch (status) {
      case 1: // 1.待支付
        payableTotal += shouldTotal; // 叠加
        item._desc = '待还款';
        if (target.unPaidBills) {
          target.unPaidBills.push(item);
        } else {
          target.unPaidBills = [item];
        }
        break;
      case 2: // 2.未出
        remainedTotal += shouldTotal; // 叠加
        item._desc = '未出';
        if (target.remainedBills) {
          target.remainedBills.push(item);
        } else {
          target.remainedBills = [item];
        }
        break;
      case 3: // 3.逾期
        item._desc = '逾期';
        payableTotal += shouldTotal; // 叠加
        if (target.overExpireBills) {
          target.overExpireBills.push(item);
        } else {
          target.overExpireBills = [item];
        }
        break;
      case 4: // 4.代扣中
        if (!isExistDoing) isExistDoing = true;
        item._desc = '正在划扣中';
        item._isDoing = true;
        if (target.payingBills) {
          target.payingBills.push(item);
        } else {
          target.payingBills = [item];
        }
        break;
        // case 5: // 5.已还
      default:
        // 重置字段 -> 已还的总金额
        const repayActAmount = toNumber(item.repayTotAmount);
        if (repayActAmount !== 0) {
          item._desc = '已还';
          item._isPaid = true;
          item._shouldTotal = repayActAmount; // 重置字段
          if (target.paidBills) {
            target.paidBills.push(item);
          } else {
            target.paidBills = [item];
          }
        }
    }
    return target;
  }, {});
  return { billsInfo, remainedTotal, payableTotal, isExistDoing };
};

export default {
  // 处理还款订单列表
  [SUBMIT_BILL_DETAIL_MANAGE](state, listData) {
    // state.isLoaded = true;
    if (!Array.isArray(listData) || listData.length === 0) {
      // empty
      state.isEmpty = true;
      state.unpaidTotal = 0;
      state.payableTotal = 0;
      return;
    }
    if (listData[0].totalAmt > 0) {
      // 前置费（已经被取消，可废弃前置费判断）
      state.isPrePayFee = true;
      state.PrePayFeeBill = [listData[0]];
      return;
    }
    const { billsInfo, remainedTotal, payableTotal, isExistDoing } = resolveBills(listData);
    state.isExistDoing = isExistDoing;
    state.unpaidTotal = toFixed(remainedTotal + payableTotal); // 未还总金额
    state.payableTotal = toFixed(payableTotal); // 可还总金额
    const {
      unPaidBills = [],
        paidBills = [],
        overExpireBills = [],
        remainedBills = [],
        payingBills = []
    } = billsInfo;
    // 赋值
    Object.assign(state, { unPaidBills, paidBills, overExpireBills, remainedBills, payingBills });
  },
  [RESET_INITED_STATE](state) {
    Object.assign(state, {
      unPaidBills: [], // 可还账单,已出账单
      paidBills: [], // 已还账单
      overExpireBills: [], // 逾期账单
      remainedBills: [], // 未出账单
      payingBills: [], // 代扣中账单
      // boundary line
      isPrePayFee: false, // 是否为前置费
      PrePayFeeBill: [], // 前置费账单详情
      isLoaded: false, // 加载完成
      isEmpty: false, // 列表为空
      isFail: false // 加载失败
    });
  },
  // 将状态致为失败
  // [STATE_BECOME_FAIL](state) {
  //   state.isLoaded = true;
  //   state.isFail = true;
  // },
  // 将状态致为加载中
  [IN_LOADING](state) {
    state.isLoaded = false;
    state.isLoading = true;
  },
  // 加载失败
  [IN_LOADED_STATE](state, isFail) {
    state.isLoaded = true;
    state.isLoading = false;
    state.isFail = isFail;
  }
};