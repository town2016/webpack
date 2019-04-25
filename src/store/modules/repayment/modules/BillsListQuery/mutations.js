// mutation
import { HANDLE_CREDIT_ORDER_LIST } from './enum/mutation-types';

export default {
  // 处理订单列表
  [HANDLE_CREDIT_ORDER_LIST](state, _payload) {
    const moduleState = state; // 拿到模块的state

    const result = _payload.result || {}; // 兼容为空的情况
    const orders = result.order || [];
    const categorize = {};
    for (const item of orders) {
      const status = item.status;
      if (categorize[status]) {
        categorize[status].push(item);
      } else {
        categorize[status] = [item];
      }
    }
    const billsOrder = [{}, {}]; // mock

    // const billsOrder = [...(categorize[2] || []), ...(categorize[1] || []), ...(categorize[3] || [])];

    // 获取当前显示的期数(逾期和正常)
    const getDisplayPhase = (item) => {
      // 逾期则返回已付账单加1
      return (
        (item.status === 2 ? Number(item.repaidPhase) + 1 : Number(item.currentPhase)) || 0
      );
    };

    const getTextState = (item) => {
      if (item.currentPhase === 0) {
        return '咨询服务费';
      } else {
        // 账单状态1.正常 2. 逾期 3. 结清
        const status = item.status;
        return status === 3 ? '当前已还' : status === 2 ? '已逾期' : '待还款';
      }
    };

    billsOrder.forEach((x) => {
      const repayDueCapital = (x.repayDueCapital * 1 || 0).toFixed(2);
      const repayTotCapital = (x.repayTotCapital * 1 || 0).toFixed(2);

      x.repayDueCapital = repayDueCapital; // 还款金额
      x.repayTotCapital = repayTotCapital; // 总金额

      x.displayPhase = getDisplayPhase(x); // 当前显示的期数
      x.textState = getTextState(x); // 文本状态
    });
    // 排序
    moduleState.billsOrder = billsOrder;
    moduleState.repayTotal = result.repayDueCapitalCount || '0.00';
  }
};