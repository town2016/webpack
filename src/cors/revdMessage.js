import eventModule from 'events'

const event = new eventModule.EventEmitter()
/*
 * 接收方发送消息
 * requestID 接收到的请求的request
 * Callback 接收到请求的回调function的字符串
 * params 回调参数 结构 { flag:true/false,msg:"错误信息",data:{ ... } }
 */
export const postMessage = function (requestID = "",Callback = "",params = null,win = window,origin = '*',winHandler){
	win.postMessage(JSON.stringify({
		requestID,
		Callback,
		params
	}),origin,winHandler)
}

export const on = function (method,func){
	event.on(method,func)
}

export const off = function (method){
	event.removeListener(method)
}

//接收命令
window.addEventListener('message', event => {
	const { currentTaget,source,origin,data } = event
	//自身发出的
	if(source === window){ return }
	const { method,params,requestID } = data
	//没有相应的方法
	if(!method || !requestID){ return }
	//触发事件的方式 method调用什么方法 params参数 requestID请求带的 回调的时候需要的
	event.emit(method,typeof params === 'string'? JSON.parse(params) : params,requestID)
})



