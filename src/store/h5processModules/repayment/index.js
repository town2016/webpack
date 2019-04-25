import orderPay from './modules/orderPay';
// import BillDetailOperate from './modules/BillDetailOperate';
// import EarlyBillsRepay from './modules/EarlyBillsRepay';
// import billsListQuery from './modules/billsListQuery';
import billDetailSearch from './modules/billDetailSearch';
// import repayDetail from './modules/repayDetail';

export default {
  namespaced: true,
  modules: {
    orderPay,
    // BillDetailOperate,
    // EarlyBillsRepay,
    // billsListQuery,
    billDetailSearch
    // repayDetail
  }
};
