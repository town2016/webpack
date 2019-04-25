import actions from './actions';
import mutations from './mutations';

// 还款账单列表
export default {
  namespaced: true,
  state: {
    unPaidBills: [], // 可还账单,已出账单
    paidBills: [], // 已还账单
    overExpireBills: [], // 逾期账单
    remainedBills: [], // 未出账单
    payingBills: [], // 代扣中账单
    // boundary line
    isPrePayFee: false, // 是否为前置费
    PrePayFeeBill: [], // 前置费账单详情,是一个数组
    isLoaded: false, // 加载完成
    isLoading: false, // 是否正在加载
    isEmpty: false, // 列表为空
    isFail: false, // 加载失败（判断加载完成的状态）
    unpaidTotal: null, // 未还总金额
    payableTotal: null, // 可还总金额
    isExistDoing: false // 存在划扣中的订单(此时不能进行提前结清)
    // boundary line
    // oId: null
  },
  getters: {
    //是否存在划扣中的单
    isExistDoing: (state) => state.isExistDoing,
    isExistPayable: (state) => Boolean(state.unPaidBills.length),
    // 是否存在未出账单
    isExistUndo: (state) => {
      const remainedBills = state.remainedBills || [];
      return remainedBills.length !== 0;
    },
    isPrePayFee: (state) => state.isPrePayFee,
    PrePayFeeBill: (state) => state.PrePayFeeBill,
    // 未支付账单
    // unPaidBills: (state) => state.unPaidBills,
    payableBills: (state) => {
      const { unPaidBills, overExpireBills } = state;
      return [...overExpireBills, ...unPaidBills];
    },
    needRepayBills: (state, getters) => {
      const { payableBills } = getters;
      const { remainedBills } = state;
      return [...payableBills, ...remainedBills];
    },
    shouldRepayBills: (state, getters) => { // 页面上的应还列表数据
      const { needRepayBills } = getters;
      const { isLoaded, isEmpty, payingBills, isPrePayFee, PrePayFeeBill } = state;
      if (!isLoaded) { // 还未加载完成
        return []; // 会返回空
      }
      if (isEmpty) {
        return [];
      }
      if (isPrePayFee) { // 前置费
        return PrePayFeeBill;
      }
      // 加载完成
      return [
        ...payingBills,
        ...needRepayBills
      ];
    },
    paidBills: (state) => state.paidBills, // 页面上的已还列表数据
    unpaidTotal: (state) => state.unpaidTotal, // 未还总金额
    payableTotal: (state) => state.payableTotal, // 可还总金额
    phasesTotal: (state) => { // 总期数
      const { unPaidBills, paidBills, overExpireBills, remainedBills, payingBills } = state;
      return unPaidBills.length + paidBills.length + overExpireBills.length + remainedBills.length + payingBills.length;
    },
    isLoading: (state) => state.isLoading,
    isLoaded: (state) => state.isLoaded,
    isFail: (state) => state.isFail
  },
  actions,
  mutations
};