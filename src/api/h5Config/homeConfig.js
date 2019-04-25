const requestPath = "commonRequest/h5ProcessRequest";

/**
 * 获取首页信息接口
 * @response {Boolean} isSettled 是否结清 true已结清 false未结清
 * @response {Boolean} havePayableBill 是否有可还账单(如果已结清,则此字段不返回)
 * @response {string} repaymentAbleAmount 应还金额(已结清或无可还账单时此字段不返回)
 * @response {string} oid 订单oid
 */
export const API_HOME = {
  requestPath,
  url: '/order.do?method=home',
  method: 'GET'
};

/**
 * 获取首页信息接口
 * @response {Boolean} isSettled 是否结清 true已结清 false未结清
 * @response {Boolean} havePayableBill 是否有可还账单(如果已结清,则此字段不返回)
 * @response {string} repaymentAbleAmount 应还金额(已结清或无可还账单时此字段不返回)
 * @response {string} oid 订单oid
 */
export const API_GET_LIMIT_INFO= {
  requestPath,
  url: 'limit.do?method=getLimitInfo',
  method: 'GET'
};

export const API_GET_LATEST_CREDIT_DEDUCT_RESULT = {
  requestPath,
  url: '/pay.do?method=getLatestCreditDeductResult',
  method: 'GET'
};
