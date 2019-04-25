//import factory from '../factory'

//可能会有多种request处理
//request.js 需要返回 export default function(){}
//给定字符串路径的目的 1.异步加载 2.区别request
//处理request的引用路径
const requestPath = 'commonRequest/h5ProcessRequest';

//注册request
//factory.register([requestPath])

// 获取用户最新额度相关信息
export const GETEVALUATELIMITINFO = {
	requestPath,
	url:"limit.do?method=getLimitInfo",
	method:"post"
};
