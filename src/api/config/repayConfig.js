// import factory from '../factory';

// 可能会有多种request处理
// request.js 需要返回 export default function(){}
// 给定字符串路径的目的 1.异步加载 2.区别request
// 处理request的引用路径
const requestPath = 'commonRequest/axiosRequest';

// 注册request
// factory.register([requestPath]);

export const APINAME = {
  requestPath,
  url: '我是api APINAME',
  method: 'post'
};

/*
 *@name getAiQiYiOrderId
 *@desc 获取爱奇艺的借款订单id
 */
export const GETAIQIYIORDERID = {
  requestPath,
  url: 'business.do?method=repaymentList',
  method: 'get'
};

/*
 *@name GetOrderDetailList
 *@desc 获取订单详情列表(未出账单，应还账单)
 */
export const GETORDERDETAILLIST = {
  requestPath,
  url: 'business.do?method=accountStatementDetail',
  method: 'get'
};

/*
 *@name getCreditBillList
 *@desc 获取订单详情列表(未出账单，应还账单)
 */
export const GETCREDITBILLLIST = {
  requestPath,
  url: 'business.do?method=getCreditBillList',
  method: 'get'
};

/*
 *@name GetEarlyAllRepayInfo
 *@desc 获取提前结清账单的信息
 *@params { oId } 对应账单oId
 *@return
 */
export const GETEARLYALLREPAYINFO = {
  requestPath,
  url: 'carOwner.do?method=carOwnerSettlementInfo',
  method: 'get'
};

/*
 *@name repaymentOrderPay
 *@desc 还款账单支付
 */
export const REPAYMENTORDERPAY = {
  requestPath,
  url: 'pay.do?method=repayment',
  method: 'get'
};

/*
 *@name queryPreferredBankCard
 *@desc 获取首选的银行卡
 */
export const QUERYPREFERREDBANKCARD = {
  requestPath,
  url: 'pay.do?method=getFirstRepayCard',
  method: 'get'
};

/*
 *@name EnsureNeedBindToThird
 *@desc 确认需要绑定第三方
 *@return { Bool } true->需要绑定;false->不需要绑定
 */
export const ENSURENEEDBINDTOTHIRD = {
  requestPath,
  url: 'pay.do?method=isNeedBindToThird',
  method: 'get'
};

/*
 *@name getSmsCode
 *@desc 获取宝付手机验证码,同时会校验提交的信息
 */
export const GETSMSCODE = {
  requestPath,
  url: 'pay.do?method=getSmsCode',
  method: 'get'
};

/*
 *@name confirmBindToThird
 *@desc 绑卡到第三方协议
 */

export const CONFIRMBINDTOTHIRD = {
  requestPath,
  url: 'pay.do?method=confirmBind',
  method: 'get'
};

/*
 *@name getGuangFaHrefUrlToBind
 *@desc 获取绑定广发银行的跳转url
 */
export const GETGFHREFURLTOBIND = {
  requestPath,
  url: 'legalBusiness.do?method=activeDepositAccount',
  method: 'get'
};

// /*
//  *@name getRealNameInformation
//  *@desc 获取实名信息
//  */
// export const GETREALNAMEINFO = {
//   requestPath,
//   url: "user.do?method=getRealNameInformation",
//   method: "get",
// };

/* 获取爱奇艺订单的对应oid
 */
export const GETAIQIYIOID = {
  requestPath,
  url: 'business.do?method=getCreditLoanInfoByParterOrderId',
  method: 'get'
};
