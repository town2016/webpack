import actions from './actions';
import mutations from './mutations';

// loading -> empty | valuable | fail
const valAssign = function(value) {
  if (value === null) {
    return 'loading';
  } else if (value === false) {
    return 'fail';
  } else if (value.length) {
    return 'valuable';
  }
  return 'empty';
};

// 还款账单列表
export default {
  namespaced: true,
  state: {
    shouldRepayArr: null, // false表示获取数据失败
    unpaidBillsArr: null, // false表示获取数据失败
    oId: null
  },
  getters: {
    shouldRepayArr: (state) => state.shouldRepayArr,
    unpaidBillsArr: (state) => state.unpaidBillsArr,
    shouldRepayArrState: (state) => valAssign(state.shouldRepayArr),
    unpaidBillsArrState: (state) => valAssign(state.unpaidBillsArr),
    oId: (state) => state.oId
  },
  actions,
  mutations
};
