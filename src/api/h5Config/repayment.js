const requestPath = 'commonRequest/h5ProcessRequest';

/**
 *@name queryPreferredBankCard
 *@desc 获取首选的银行卡
 */
export const QUERYPREFERREDBANKCARD = {
  requestPath,
  url: 'pay.do?method=getFirstRepayCard',
  method: 'get'
};

/**
 *@name getRepaymentList
 *@desc 还款明细查询
 */
export const API_GET_REPAYMENT_LIST = {
  requestPath,
  url: 'pay.do?method=repaymentList',
  method: 'get'
};

/**
 *@name orderRepay
 *@desc 还款支付
 *@param cardNoQUERY {String} 还款银行卡号
 *@param payChannelQUERY {String} 支付渠道：2宝富；
 *@param bankName {String} 银行名称
 *@param payTypeQUERY {String} 还款的产品类型:creditLoan只支持信贷还款
 *@param repaymentListJsonQUERY {Object} jsonString类型
 *@property applyid {Number} 申请id
 *@property money {Number} 金额
 *@property repayType {Number} 还款类型0.前置金 1.正常还款 3.提前结清
 *@property phases {String} 期数，多期“,“隔开
 */

export const API_ORDER_REPAY = {
  requestPath,
  url: 'pay.do?method=repayment',
  method: 'post'
};

/**
 *@name earlySettleFee
 *@desc 获取提前结清信息
 *@params oid {String} 订单唯一标识
 */

export const API_EARLY_SETTLE_FEE = {
  requestPath,
  url: 'pay.do?method=earlySettlementFee',
  method: 'post'
};
