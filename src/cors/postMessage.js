import travel from './state'


const requestMap = new Map()

//调用postMessage通知
//接收
window.addEventListener('message', event => {
	const { currentTaget,source,origin,data } = event
	//自身发出的
	if(source === window){ return }
	//解析
	const { requestID,Callback,params } = data
	//没有找到回调
	//或者没有Callback key
	if(!requestID || !requestMap.has(requestID) || !Callback){ return }
	//拿到节点
	const requestObj =  requestMap.get(requestID)
	const callbackFunc = requestObj.getFunc(Callback)
	if(typeof callbackFunc === 'function'){
		callbackFunc(typeof params === 'string'? params : JSON.parse(params))
	}
	//删除记录
	requestMap.delete(requestID)
})

/*
 * 发送方发送命令
 * method 需要调用的方法
 * params 参数
 */
export const postMessage = function (method = "",params = {},win = window,origin = '*',winHandler){
	const requestID = `REQUEST_${Date.now()}`
	const travelObj = new travel()
	params = travelObj.travel(params)
	//检测是否有回调内容 有就记录
	//保持记录 方便回调
	travelObj.hasCallback() && requestMap.set(requestID,travelObj)
	//发送消息
	win.postMessage(JSON.stringify({ method,params,requestID }),origin,winHandler)
}