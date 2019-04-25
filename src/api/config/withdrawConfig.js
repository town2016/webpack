//import factory from '../factory'

//可能会有多种request处理
//request.js 需要返回 export default function(){}
//给定字符串路径的目的 1.异步加载 2.区别request
//处理request的引用路径
const requestPath = "withdrawRequest"

//注册request
//factory.register([requestPath])

// 获取可提现贷款详情
export const GETWITHDRAWDEPOSITINFO = {
	requestPath,
	url:"legalBusiness.do?method=huarunWithdraw",
	method:"get"
}

// 提现
export const WITHDRWADEPOSIT = {
	requestPath,
	url:"legalBusiness.do?method=withdrawDeposit",
	method:"get"
}

// 是否绑定第三方
export const ISBINDTHIRD = {
	requestPath,
	url:"pay.do?method=thirdQueryBind",
	method:"get"
}

// 修改服务密码
export const SETPAYPASSWORD = {
	requestPath,
	url:"/legal.do?method=getSetPayPswHttpRequestUrl",
	method:"post"
}

// 解锁账户
export const UNLOCKACCOUNT = {
	requestPath,
	url:"/legal.do?method=getUnLockAccountHttpRequestUrl",
	method:"post"
}