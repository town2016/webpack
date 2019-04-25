//import factory from '../factory'

//可能会有多种request处理
//request.js 需要返回 export default function(){}
//给定字符串路径的目的 1.异步加载 2.区别request
//处理request的引用路径
const requestPath = "commonRequest/h5ProcessRequest";

//注册request
//factory.register([requestPath])

// 获取订单状态
export const GETORDERSTATUS = {
	requestPath,
	url:"order.do?method=queryOrderProcessInfo",
	method:"post"
};

// 获取用户借款信息
export const PLACEORDER = {
	requestPath,
	url:"order.do?method=placeOrder",
	method:"post"
};

// 下单试算
export const ORDERCALCULATE = {
	requestPath,
	url:"order.do?method=calculate",
	method:"post"
};

// 下单还款计划
export const GETORDERPLAN = {
	requestPath,
	url:"order.do?method=queryPaymentPlan",
	method:"post"
}

// 获取支用规则
export const GETWITHDRAWRULES = {
	requestPath,
	url:"order.do?method=hitWithdrawRules",
	method:"post"
}

// 获取用户基本资料
export const GETINFORMATION = {
	requestPath,
	url:"user.do?method=getInformation",
	method:"post"
}

// 提交用户基本资料
export const COMMITINFORMATION = {
	requestPath,
	url:"user.do?method=commitInformation",
	method:"post"
}

// 搜索公司
export const GETCOMPANYINFO = {
	requestPath,
	url:"basic.do?method=getCompanyInfoData",
	method:"post"
}

// 搜索省
export const GETPROVINCES = {
	requestPath,
	url:"basic.do?method=getProvinces",
	method:"post"
}

// 搜索省
export const GETCITYS = {
	requestPath,
	url:"basic.do?method=getCitys",
	method:"post"
}

// 搜索区
export const GETDISTRICTS = {
	requestPath,
	url:"basic.do?method=getDistricts",
	method:"post"
}

// 获取置业岗位列表
export const GETLEGAODICT = {
	requestPath,
	url:"mortgage.do?method=getLeGaoDict&dataCode=JOB_POSITION",
	method:"post"
}

// 人脸识别
export const GETFACEURL = {
	requestPath,
	url:"/auth.do?method=getFaceUrl",
	method:"post"
}

// 获取借款协议URL
export const GETCONTRACTURL = {
	requestPath,
	url:"/order.do?method=getContractUrl",
	method:"post"
}