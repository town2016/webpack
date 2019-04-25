import { 
  BANK_CARD,
  BANK_SUPPORT_LIST,
  PAY_TYPE,
  BANK_SUPPORT_CHANNEL,
  BIND_CARD_CALLBACK_URL,
  IS_THIRD_BIND,
  SMS_CODE_SUCCESS,
  CARD_AGREEMENT
} from "@/store/modules/bankCard/enum/gettersEnum";
import allBankList from '@/utils/bankList';

export default {
  [BANK_CARD](state) {
    let defaultCard = Object.assign({},state.bankCard);
    defaultCard.afterNo = defaultCard.cardno ? defaultCard.cardno.substr(-4, 4) : undefined;
    for (let i = 0; i < allBankList.length; i++) {
      if (defaultCard.bankname == allBankList[i].fullName) {
        defaultCard.logo = allBankList[i].icon;
        break;
      }
    }
    return defaultCard;
  },
  [BANK_SUPPORT_LIST](state) {
    return state.supportBankList;
  },
  [PAY_TYPE](state) {
    return state.payType;
  },
  [BANK_SUPPORT_CHANNEL](state) {
    return state.channel;
  },
  [BIND_CARD_CALLBACK_URL](state) {
    return state.bindCardCallbackUrl;
  },
  [IS_THIRD_BIND](state) {
    return state.isThirdBind;
  },
  [SMS_CODE_SUCCESS](state) {
    return state.smsCodeSuccess;
  },
  [CARD_AGREEMENT](state) {
    return state.cardAgreement;
  }
};
