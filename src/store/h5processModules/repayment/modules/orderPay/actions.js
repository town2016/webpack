import { requireApiConfig } from '@/api/h5Config';
import { PAY_SELECTED_ORDER } from './enum/action-types';
import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';

import { SUBMIT_INITED_DATA } from './enum/mutation-types';

export default {
  // 初始化支付页面
  async initPageInfo({ commit, dispatch }, { type, order }) {
    const isEarlyPay = type === 'early'; // 是否为提前结清

    const { cardno: cardNo, bankname: bankName } = await dispatch('bankManage/getBankInfo', null, { root: true });
    // 更新order信息
    const orderInfo = await dispatch('repayment/billDetailSearch/getOrderList', { order }, { root: true });
    const isPrePayFee = orderInfo.isPrePayFee;
    // 拿到 orderInfo
    let bills, moneyTotal, phasesStr, oId;
    if (isPrePayFee) {
      // 前置费
      bills = orderInfo.PrePayFeeBill;
      moneyTotal = bills[0].totalAmt;
      phasesStr = '';
    } else if (isEarlyPay) {
      // 是否为提前结清
      bills = orderInfo.needRepayBills;
      oId = bills[0].oid;
      const response = await dispatch(FETCH_SERVER, {
        apiName: requireApiConfig('repayment/API_EARLY_SETTLE_FEE'),
        params: {
          oid: oId
        }
      }, { root: true });
      const { shouldTotalAmt, terms } = response.result;
      moneyTotal = shouldTotalAmt;
      phasesStr = terms;
    } else if (type === 'normal') {
      // 一键还款
      bills = orderInfo.payableBills;
      moneyTotal = orderInfo.payableTotal;
    } else {
      // 按期还款
      try {
        const indexs = decodeURIComponent(type).split(',');
        const orders = orderInfo.shouldRepayBills;
        bills = indexs.ruduce((total, item) => {
          const billInfo = orders[item];
          if (billInfo) total.push(billInfo);
        }, []);
      } catch (err) {
        err._isActionError = true;
        err._code = 501;
        err._desc = '解析参数失败(非法url)';
        throw err;
      }
    }

    const phaseTotal = bills.length;
    if (!phaseTotal) {
      // 未发现订单
      const currentError = new Error('未发现订单');
      currentError._isActionError = true;
      currentError._desc = '未发现订单信息';
      currentError._code = 404;
      throw currentError;
    }
    // 拿到订单oId
    if (!oId) oId = bills[0].oid;
    // 拿到phasesStr
    if (!phasesStr) {
      phasesStr = bills.reduce((total, item) => {
        total.push(item.phase);
        return total;
      }, []).join(',');
    }

    // 提交数据
    commit(SUBMIT_INITED_DATA, {
      cardNo,
      bankName,
      type,
      moneyTotal,
      phaseTotal,
      oId,
      phasesStr,
      isPrePayFee
    });
  },
  // 支付接口
  async [PAY_SELECTED_ORDER]({ dispatch, rootGetters, state }) {
    // const { cardNo, bankName } = rootGetters.bankInfo;
    const isEarlyPay = state.type === 'early';
    const isPrePayFee = state.isPrePayFee; // 是否为前置费，优先级最高
    // const { cardNo, bankName } = await dispatch('bankManage/getBankInfo', null, { root: true });

    // 0.前置金 1.正常还款 3.提前结清（如果是提前结清，则费用需加上提前结清）
    const repayType = isPrePayFee ? 0 : (isEarlyPay ? 3 : 1);
    // 拿到applyid等
    const { cardNo, bankName, moneyTotal, phasesStr, oId } = state;
    // 提交还款
    const payResult = await dispatch(FETCH_SERVER, {
      apiName: requireApiConfig('repayment/API_ORDER_REPAY'),
      params: {
        bankName,
        cardNo,
        payType: 'creditLoan', // creditLoan:信用贷
        payChannel: '2', // 2宝富
        repaymentListJson: JSON.stringify([{
          applyid: oId,
          money: Number(moneyTotal),
          repayType,
          phases: phasesStr
        }])
      }
    }, { root: true });
    return payResult;
  }
};