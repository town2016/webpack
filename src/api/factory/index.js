export const factory = class{
	constructor(){
		//用于管理注册服务 request
		this.requestMap = new Map()
		//用于管理注册的api
		//如果有通过key apiConfig的形式注册api
		//那么就可以通过factory.request(key)的形式调用 无需apiConfig
		this.apiMap = new Map()
	}
  
	//注册request
	//requestPaths 可以为数组
	register(requestPaths = ""){
		//如果是数组 则递归自己
		if(requestPaths instanceof Array){
			return requestPaths.map(this.register.bind(this))
		}

		if(
			//如果非字符串 则不处理
			typeof requestPaths !== 'string' ||
			//如果已经添加过 也不处理
			typeof requestPaths === 'string' &&  this.requestMap.has(requestPaths)
		){ return }

		//未异步加载的request
		this.requestMap.set(requestPaths,null)
	}

	//注册api
	//假如通过注册api模式 那么就可以通过factory.request("注册的apiKey")的形式进行使用
	registerApi(apiKey = "",apiConfigs = {}){
		if(typeof apiKey === 'string' && typeof apiConfigs === 'object' && Object.prototype.hasOwnProperty.call(apiConfigs,'requestPath')){
			return this.apiMap.set(apiKey,apiConfigs)
		}
		if(typeof apiKey !== 'object' && arguments.length === 1){ return }
		apiConfigs = apiKey
		//递归添加
		Object.keys(apiConfigs).map(key => {
			this.registerApi(key,apiConfigs[key])
		})
	}

	//根据注册路径 查找request 返回的是已经异步加载完毕的request
	async getRequest(requestPaths = ""){
		if(typeof requestPaths !== 'string'){ return null }
		try{
			const hasOwnProperty = Object.prototype.hasOwnProperty
			const module = await import(`../request/${requestPaths}`)
			//异步加载的模块 看看是否有default 或者 request
			const request = hasOwnProperty.call(module,'default')? module.default : module.request
			//检测当前返回的是否是函数 如果非函数返回null
			return typeof request === 'function'
				? request
				: null
		}catch(error){
			console.error(error);
			console.warn(`(${requestPaths}) getRequest 报错！`,error)
		}
		return null
	}

	//根据config 获取request
	async getRequestByApiConfig(apiConfig = ""){
		const { requestPath = "" } = apiConfig;
		if(!this.requestMap.has(requestPath) && requestPath){
			console.warn(`未注册的项目 路径:${requestPath} 建议走正常注册流程 `);
			console.warn('该config将正常解析',apiConfig);
		}
		//查看是否有加载过
		let request = this.requestMap.get(requestPath);

		if(!request){
			//没有加载过 就试图异步加载
			request = await this.getRequest(requestPath);
			//有返回结果 就把当前路径记录
			request && this.requestMap.set(requestPath,request);
		}
		return request
	}

	async getRequestByApiname(apiName = ""){
		const apiConfig = this.apiMap.get(apiName);

		//没有找到apiConfig的时候 直接返回null
		if(
			!apiConfig ||
			typeof apiConfig === 'object' && !Object.prototype.hasOwnProperty.call(apiConfig,'requestPath')
		){ return null }

		//通过apiConfig返回 request
		return await this.getRequestByApiConfig(apiConfig)
	}

	//处理请求
	/*
	 * config 定义的api相关的配置
	 * requestParams 请求参数
	 * otherParams 请求相关的其他参数
	 */
	async request(apiConfig = null,requestParams,otherParams){
		const args = Array.from(arguments).splice(1)
		let request = null
		try{
			request = typeof apiConfig === 'object' && Object.prototype.hasOwnProperty.call(apiConfig,'requestPath')
				//通过apiConfig { requestPath:"..." } 方式查询
				? await this.getRequestByApiConfig(apiConfig)
				//通过this.apiMap 注册的api里查询
				: await this.getRequestByApiname(apiConfig)
		}catch(error){ console.log(error) }
		if(request == null || typeof request !== 'function'){
			console.warn(`没有找到相应的request`,apiConfig,request)
		}
		const result = request(typeof apiConfig === 'object'? apiConfig : {},...args)
		return result instanceof Promise? await result : result
	}
}

export default new factory
