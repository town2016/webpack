import { queryPreferredBankCard } from '@/store/modules/repayment/enum/action-types';
import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';
// import { requireApiConfig } from '@/api/config';
// import { getItemByOnePair } from '@/utils/helpers';
// import { SHOW_TOAST } from '@/store/commonModules/Toast/enum/actionsEnum';

import {
  _BILL_DETAIL_MANAGE,
  STATE_BECOME_FAIL,
  CLEAR_WHOLE_DATA
} from './enum/mutation-types';

export default {
  // 获取爱奇艺的借款订单id
  async _getAiqiyiOrderId({ dispatch }, { tcorderid }) {
    try {
      const response = await dispatch(FETCH_SERVER, {
        apiName: 'repayConfig/GETAIQIYIOID', // GETAIQIYIORDERID
        params: {
          partnerOrderId: tcorderid
        }
      }, { root: true });
      if (response.result) {
        console.log(response.result);
        return response.result.oid;
      } else {
        const errBody = new Error('未发现该订单');
        errBody.errStatus = 1;
        throw errBody;
        // 无对应订单，为空
        // return null;
      }
    } catch (err) {
      console.log(err);
      console.error('获取oId失败，返回调试oId');
      throw err;
      // return '143018843653132382';
    }
  },
  // 获取订单详情列表
  async getCreditBillDetail({ commit, dispatch, rootGetters, rootState }, { tcorderid }) {
    // setTimeout(() => {
    //   commit(_BILL_DETAIL_MANAGE, {
    //     result: {
    //       shoulReturn: [{
    //           shouldInterest: 1178.61, // 应还利息
    //           overdueInterest: 0, // 逾期利息
    //           earlyRepayFee: 30, // 提前还款手续费
    //           shouldRepayAmt: 458.33, // 应还本金
    //           shouldTotal: 3029.20, // 总计
    //           phase: 1,
    //           withholdStatus:5,
    //         },
    //         {
    //           shouldInterest: 1178.61, // 应还利息
    //           overdueInterest: 2, // 逾期利息
    //           earlyRepayFee: 30, // 提前还款手续费
    //           shouldRepayAmt: 458.33, // 应还本金
    //           shouldTotal: 3029.20, // 总计
    //           phase: 2,
    //           withholdStatus:0,
    //         }, {
    //           shouldInterest: 1178.61, // 应还利息
    //           overdueInterest: 0, // 逾期利息
    //           earlyRepayFee: 30, // 提前还款手续费
    //           shouldRepayAmt: 458.33, // 应还本金
    //           shouldTotal: 3029.20, // 总计
    //           phase: 3,
    //           withholdStatus:0,
    //         }
    //       ],
    //       notYet: [{
    //         shouldRepayDate: '2018-10-29 00:00:00',
    //         shouldTotal: '110.00',
    //       }],
    //     },
    //     oId: '123',
    //   });
    // }, 1500);
    // return
    try {
      commit(CLEAR_WHOLE_DATA); // 清除详情数据 -> 进入加载中状态
      const oId = await dispatch('_getAiqiyiOrderId', { tcorderid });
      if (oId === null) { // 无对应订单，为空
        commit(_BILL_DETAIL_MANAGE, {
          result: {
            shoulReturn: [],
            notYet: []
          }
        }); // 提交账单
        return;
      }
      // 144798316241936237
      const bankinfo = await dispatch(`repayment/${queryPreferredBankCard}`, null, { root: true });

      const idCard = bankinfo.idcard; // idcard
      if (!idCard) { // 未拿到idCard
        const errBody = new Error('未发现其实名绑卡信息');
        errBody.errStatus = 2;
        throw errBody;
      }
      const detail = await dispatch(FETCH_SERVER, {
        apiName: 'repayConfig/GETCREDITBILLLIST',
        params: {
          oId,
          idCard
        }
      }, { root: true });
      console.log(detail);
      detail.oId = oId;
      // commit(SUBMIT_BANK_INFO, bankinfo); // 提交银行卡信息

      commit(_BILL_DETAIL_MANAGE, detail); // 提交账单
    } catch (err) {
      commit(STATE_BECOME_FAIL); // 发生错误
      throw err;
    }
  },
  clearComponentData({ commit }) {
    commit(CLEAR_WHOLE_DATA);
  }
};