import { filterBankByKey } from '@/utils/bankList';
// import { requireApiConfig } from '@/api/config';

import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';
import { queryPreferredBankCard } from '@/store/modules/repayment/enum/action-types';

import { _BANK_LIST_ASSEMBLE } from './enum/mutation-types';

export default {
  // 绑定第三方协议
  async bindToThird({ dispatch, getters }, { code }) {
    const { cardNo, bankName } = getters.bankInfo;
    const result = await dispatch(FETCH_SERVER, {
      apiName: 'repayConfig/CONFIRMBINDTOTHIRD',
      config: { isLoading: true, isToast: true },
      params: {
        bankName,
        smsCode: code,
        cardno: cardNo
      }
    }, { root: true });
    return result;
  },
  // 获取跳转广发的url
  async bindGuangFaBank({ getters, dispatch }, { callbackUrl }) {
    // const response = dispatch('_bindGuangFaBank', { bankCode, phone, cardNo });
    const { bankCode, phone, cardNo } = getters.bankInfo;
    const bankInfoStr = JSON.stringify({
      bankAccno: cardNo,
      bankAccount: bankCode,
      mobile: phone
    });
    const result = await dispatch(FETCH_SERVER, {
      apiName: 'repayConfig/GETGFHREFURLTOBIND',
      config: { isLoading: true, isToast: true },
      params: {
        bankInfo: bankInfoStr,
        callbackUrl
      }
    }, { root: true });
    return result;
  },
  // 初始化支付页面
  async PayInitDataSubmit({ commit, dispatch }, { money }) {
    const bankData = await dispatch(`repayment/${queryPreferredBankCard}`, null, { root: true });
    const { bankname, cardno, bankCode, phone, isGFBind, thirdQueryBind } = bankData;
    const bankInfo = {
      bankName: bankname,
      cardNo: cardno, // 银行卡号
      bankFourDigits: cardno.substr(-4, 4),
      isBindGF: isGFBind, // 是否绑定存管（广发）
      isNeedAgree: null, // 是否需要开通协议支付
      curBankState: null, // 0->OK,1->未完成确认,2->未绑定存管
      phone,
      bankCode, // 银联号
      ...filterBankByKey(bankname) // 混入银行信息
    };
    // thirdQueryBind -> 是否绑定了第三方
    // isNeedAgree -> true:需要绑定；false：不需要绑定
    const isNeedAgree = !thirdQueryBind;
    bankInfo.curBankState = !isNeedAgree ? bankInfo.isBindGF ? 0 : 2 : 1;
    bankInfo.isNeedAgree = isNeedAgree;
    commit(_BANK_LIST_ASSEMBLE, bankInfo);
  },
  // 获取协议支付的验证码
  async getAgreementCheckCode({ getters, dispatch }, { telephone: mobile }) {
    const { bankCode: bankAccount, bankName: bankname, cardNo: cardno } = getters.bankInfo;
    const result = await dispatch(FETCH_SERVER, {
      apiName: 'repayConfig/GETSMSCODE',
      config: { isLoading: true, isToast: true },
      params: {
        bankAccount,
        bankname,
        cardno,
        mobile
      }
    }, { root: true });
    return result;
  },
  // 支付接口
  async willStartPay({ dispatch, getters }, { repaymentListJson }) {
    const { cardNo, bankName } = getters.bankInfo;
    const payResult = await dispatch(FETCH_SERVER, {
      apiName: 'repayConfig/REPAYMENTORDERPAY',
      config: { isLoading: true, isToast: true },
      params: {
        bankName,
        cardNo,
        payType: 'creditLoan', // creditLoan:信用贷
        payChannel: '2', // 2宝富
        repaymentListJson
      }
    }, { root: true });
    return payResult;
  },
  // 查看协议内容
  async checkProtocal({ dispatch }) {
    console.log('checkProtocal');
    // #@todo
    // 跳转协议页
  }
};
