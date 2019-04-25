import actions from './actions';
import mutations from './mutations';

// loading -> valuable | fail
const valAssign = function(value) {
  if (value === null) {
    return 'loading';
  } else if (value === false) {
    return 'fail';
  } else {
    return 'valuable';
  }
  // return 'empty';
};

// 还款账单列表
export default {
  namespaced: true,
  state: {
    repayDatailArr: null // false表示获取数据失败
  },
  getters: {
    repayDatailArr: (state) => state.repayDatailArr,
    repayDatailArrState: (state) => valAssign(state.repayDatailArr)
  },
  actions,
  mutations
};