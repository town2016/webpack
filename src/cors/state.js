export default class functionMap{
	constructor(){
		this.map = new Map()
	}

	travel(params){
		return typeof params === 'object'
			? params instanceof Array? travelArray(params,this.map) : travelObject(params,this.map)
			: null
	}

	hasCallback(){
		return this.map.size > 0
	}

	getFunc(key){
		return this.map.get(key)
	}
}


//用于生成
const createKey = function (){
	return `cros-key-${Date.now()}`
}

const insertFunction = function (func,map){
	if(typeof func !== 'function'){ return }
	const key = createKey()
	functionMap.set(key,func)
	return key
}

//循环object 找出function
const travelObject = function (obj,map){
	Object.keys(obj).forEach(key => {
		const value = obj[key]
		if(typeof value !== 'function'){
			return travel(value)
		}
		//转化function
		obj[key] = insertFunction(value,map)
	})
	return obj
}

//循环array 找出function 并且替换为key
const travelArray = function (array,map){
	return array.map(value => {
		if(typeof value !== 'function'){
			return travel(value)
		}
		return insertFunction(value,map)
	})
}