import { requireApiConfig } from '@/api/h5Config';
import { GET_CURRENT_BANK_INFO, COMFIRM_BIND_CARD, GET_SMS_CODE, GET_CARD_AGREEMENT } from './enum/action-types';
import { COMMIT_BANK_INFO } from './enum/mutation-types';

export default {
  // 获取当前银行卡(页面初始化)
  async [GET_CURRENT_BANK_INFO]({ dispatch, commit }) {
    // 获取银行卡信息(可能为空)
    const bankInfo = await dispatch('bankManage/getBankInfo', null, { root: true });
    console.log(bankInfo);
    if (bankInfo) { // bankInfo可能为null
      const { isGFBind, bankCode } = bankInfo;
      // if (thirdQueryBind) {
      //   const err = new Error('已经确认过银行卡');
      //   err.isActionError = true;
      //   err.desc = '你确认过银行卡，无需重复确认';
      //   throw err;
      // }
      if (!isGFBind) {
        const err = new Error('还未绑定广发');
        err.isActionError = true;
        err.desc = '请先进行广发授权';
        throw err;
      }
      const supportBankList = await dispatch('bankManage/supportBanksQuery/getSupportBanks', null, { root: true });
      const searchResult = supportBankList.find((elem) => {
        if (!elem) {
          return false;
        }
        return elem.bankCode === bankCode;
      });
      commit(COMMIT_BANK_INFO, { bankInfo, notSupportBank: !searchResult });
    }
    return bankInfo;
  },
  // 获取短信验证码
  async [GET_SMS_CODE]({ dispatch, state }) {
    const bankInfo = state.bankInfo;
    const { bankname, cardno, bankCode, phone } = bankInfo;
    const response = await dispatch('fetchServer', {
      apiName: requireApiConfig('bankManage/API_GET_SMS_CODE'),
      params: {
        bankAccount: bankCode,
        bankname,
        cardno,
        mobile: phone
      }
    }, { root: true });
    return response;
  },
  // 确认绑卡
  async [COMFIRM_BIND_CARD]({ dispatch, state }, { smsCode }) {
    const bankInfo = state.bankInfo;
    const { bankname, cardno, bankCode } = bankInfo;
    const requstParams = {
      bankName: bankname,
      cardno: cardno,
      bankAccount: bankCode
    };
    if (smsCode) {
      requstParams.smsCode = smsCode;
    }
    const response = await dispatch('fetchServer', {
      apiName: requireApiConfig('bankManage/API_COMFIRM_BIND_CARD'),
      params: requstParams
    }, { root: true });
    return response;
  },
  // 获取绑卡协议
  async [GET_CARD_AGREEMENT]({ dispatch }) {
    const response = await dispatch('fetchServer', {
      apiName: requireApiConfig('bankManage/API_GET_CARD_AGREEMENT')
    }, { root: true });
    return response.result.pdfSignUrl;
  }
};