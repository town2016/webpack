//import factory from '../factory';

const requestPath = 'bankCardRequest';


// 注册request
//factory.register([requestPath]);

/**
 * 获取银行卡列表
 */
export const API_GET_FIRST_REPAY_CARD = {
  requestPath,
  url: 'pay.do?method=getFirstRepayCard',
  method: 'get'
};

// parseReceiptUrl
export const API_PARSE_RECEIPT_URL = { requestPath, url: '', method: 'get' };
/**
 * getSmsCode 获取短信验证码
 */
export const API_GET_SMS_CODE = { 
  requestPath, 
  url: 'pay.do?method=getSmsCode', 
  method: 'get' 
};
// ocrBankCard 
export const API_OCR_BANK_CARD = { requestPath, url: 'ocr/bankcard', method: 'post' };
// queryBankSupportList 获取支持绑定的银行
export const API_QUERY_BANK_SUPPORT_LIST = { 
  requestPath, 
  url: 'pay.do?method=queryBankSupportList',
  method: 'get' 
};

/**
 * getPayType 获取支付类型
 */
export const API_GET_PAY_TYPE = {
  requestPath,
  url: 'pay.do?method=getPayType',
  method: 'get'
}

/**
 * addBankCard 绑定银行卡
 */
export const API_BIND_BANK_CARD = { 
  requestPath, 
  url: 'pay.do?method=huarunChangeBankCard', 
  method: 'get' 
};
/**
 * getBindBankCardHttpRequestUrl
 */
export const API_GET_BIND_BANK_CARD_HTTP_REQUEST = { requestPath, url: '', method: 'get' };
/**
 * getCardAgreement 获取协议列表
 */
export const API_GET_CARD_AGREEMENT = { 
  requestPath, 
  url: 'pay.do?method=getCardAgreement', 
  method: 'get' 
};

/**
 * isBindThird 校验第三方是否绑定过银行卡
 */
export const API_THIRD_QUERY_BIND = { 
  requestPath, 
  url: 'pay.do?method=thirdQueryBind', 
  method: 'get' 
};
