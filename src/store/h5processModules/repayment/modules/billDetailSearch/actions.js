// import { queryPreferredBankCard } from '@/store/modules/repayment/enum/action-types';
import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';

// import { requireApiConfig } from '@/api/config';
// import { getItemByOnePair } from '@/utils/helpers';
// import { SHOW_TOAST } from '@/store/commonModules/Toast/enum/actionsEnum';
import { requireApiConfig } from '@/api/h5Config';
// actions
import {
  // GET_EARLY_SETTLE_FEE,
  // boundary
  SUBMIT_SELECTED_PHASES,
  GET_ORDER_LIST
} from './enum/action-types';
// mutations
import {
  SUBMIT_BILL_DETAIL_MANAGE,
  RESET_INITED_STATE,
  IN_LOADED_STATE
} from './enum/mutation-types';

export default {
  // 获取订单详情列表
  // async [GET_CREDIT_BILL_DETAIL]({ commit, dispatch, rootGetters, rootState }, { tcorderid }) {
  //   console.log('mock');
  //   // mock
  //   setTimeout(() => {
  //     commit(SUBMIT_BILL_DETAIL_MANAGE, {
  //       result: {
  //         shoulReturn: [{
  //           shouldInterest: 1178.61, // 应还利息
  //           overdueInterest: 0, // 逾期利息
  //           earlyRepayFee: 30, // 提前还款手续费
  //           shouldRepayAmt: 458.33, // 应还本金
  //           shouldTotal: 3029.20, // 总计
  //           phase: 1,
  //           withholdStatus: 5
  //         },
  //         {
  //           shouldInterest: 1178.61, // 应还利息
  //           overdueInterest: 2, // 逾期利息
  //           earlyRepayFee: 30, // 提前还款手续费
  //           shouldRepayAmt: 458.33, // 应还本金
  //           shouldTotal: 3029.20, // 总计
  //           phase: 2,
  //           withholdStatus: 0
  //         }, {
  //           shouldInterest: 1178.61, // 应还利息
  //           overdueInterest: 0, // 逾期利息
  //           earlyRepayFee: 30, // 提前还款手续费
  //           shouldRepayAmt: 458.33, // 应还本金
  //           shouldTotal: 3029.20, // 总计
  //           phase: 3,
  //           withholdStatus: 0
  //         }
  //         ],
  //         notYet: [{
  //           shouldRepayDate: '2018-10-29 00:00:00',
  //           shouldTotal: '110.00'
  //         }]
  //       },
  //       oId: '123'
  //     });
  //   }, 1500);
  // },
  // 获取订单信息
  async [GET_ORDER_LIST]({ dispatch, commit, getters }, { order = null } = {}) {
    // 还原初始数据
    commit(RESET_INITED_STATE);
    try {
      const optionsParams = order ? { oid: order } : {};
      // 请求新数据
      const response = await dispatch(FETCH_SERVER, {
        apiName: requireApiConfig('repayment/API_GET_REPAYMENT_LIST'),
        params: {
          repaymentStatus: 0,
          ...optionsParams
        }
      }, { root: true });
      const result = response.result;
      // 提交新数据
      commit(SUBMIT_BILL_DETAIL_MANAGE, result || []);
      // 将状态标为成功
      commit(IN_LOADED_STATE, false);
      return getters; // 返回getters
    } catch (err) {
      console.error(err);
      // 将状态标为失败
      commit(IN_LOADED_STATE, true);
      return Promise.reject(err); // 返回error
    }
  }
};