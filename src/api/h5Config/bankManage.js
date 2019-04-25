const requestPath = 'commonRequest/h5ProcessRequest';

/**
 * @name queryBankInfo
 * @desc 查询银行卡信息
 */

export const API_QUERY_BANK_INFO = {
  requestPath,
  url: 'pay.do?method=getFirstRepayCard',
  method: 'get'
};

/**
 * @name API_TO_GRANT_AUTHORIZATION
 * @desc 跳转授权-广发
 */

export const API_TO_GRANT_AUTHORIZATION = {
  requestPath,
  url: 'legal.do?method=getAuthorityHttpRequestUrl',
  method: 'get'
};

/**
 * @name getSmsCode
 * @desc 获取手机短信验证码
 * @param bankAccount {String} 联行号
 * @param bankname {String} 发卡行银行名称
 * @param cardno {String} 银行卡号
 * @param mobile {String} 预留手机号
 */

export const API_GET_SMS_CODE = {
  requestPath,
  url: 'pay.do?method=getSmsCode',
  method: 'POST'
};

/**
 * @name comfirmBindCard
 * @desc 确认绑卡
 * @param bankName {String} 发卡行银行名称
 * @param cardno {String} 银行卡号
 * @param smsCode {String} 验证码
 */

export const API_COMFIRM_BIND_CARD = {
  requestPath,
  url: 'pay.do?method=confirmBind',
  method: 'POST'
};

/**
   * 查询宝付支持的银行卡列表
   * @param {any} channel 还款方式 1:连连，2宝付
   * @returns
   */
export const API_QUERY_BANK_SUPPORT_LIST = {
  requestPath,
  url: 'pay.do?method=queryBankSupportList',
  method: 'get'
};

/**
   * 获取绑卡协议
   * @name getCardAgreement
   * @returns
   */
export const API_GET_CARD_AGREEMENT = {
  requestPath,
  url: 'pay.do?method=getCardAgreement',
  method: 'get'
};