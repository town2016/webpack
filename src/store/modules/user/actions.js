import { APINAME } from '@/api/config/repayConfig'
import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum'
import {
	LOGIN,
	ERROR
} from './enum/actionsEnum'


export default {
	//dispatch('someOtherAction', null, { root: true })
	//commit('someMutation', null, { root: true })
	//rootGetters.someGetter
	async [LOGIN]({ commit,dispatch },{ username = "",pwd = "",validCode = "",isLoading = false,isToast = true } = {}){
		try{
			const response = await dispatch(FETCH_SERVER,{  
				apiName:APINAME,
				config:{ isLoading,isToast },
				params:{ username,pwd,validCode },
				extraFetchConfig:{}
			},{ root: true })
			
			console.log(response)
		}catch(error){
			console.log(error)
		}
	}
} 