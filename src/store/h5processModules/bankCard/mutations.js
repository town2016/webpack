import { 
  SET_BANK_CARD,
  SET_BANK_SUPPORT_LIST,
  SET_PAY_TYPE,
  SET_BANK_SUPPORT_CHANNEL,
  SET_BIND_CARD_CALLBACK_URL,
  SET_IS_THIRD_BIND,
  SET_SMS_CODE_SUCCESS,
  SET_CARD_AGREEMENT
} from './enum/mutationsEnum'

export default {
  [SET_BANK_CARD](state, { result }) { // 设置银行卡
    state.bankCard = result;
  },
  [SET_BANK_SUPPORT_LIST](state, { result }) {
    state.supportBankList = result;
  },
  [SET_PAY_TYPE](state, { result }) {
    state.payType = result;
  },
  [SET_BANK_SUPPORT_CHANNEL](state, channel) {
    state.channel = channel;
  },
  [SET_BIND_CARD_CALLBACK_URL](state, url) {
    state.bindCardCallbackUrl = url;
  },
  [SET_IS_THIRD_BIND](state, isThirdBind) {
    state.isThirdBind = isThirdBind;
  },
  [SET_SMS_CODE_SUCCESS](state, isSuccess) {
    state.smsCodeSuccess = isSuccess;
  },
  [SET_CARD_AGREEMENT](state, cardAgreement) {
    state.cardAgreement = cardAgreement;
  }
}