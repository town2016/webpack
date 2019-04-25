import { ACTIONS_BEGIN_LOADING,ACTIONS_FINISH_LOADING } from './enum/actionsEnum'
import { ADD_ONCE_LOADING,DEL_ONCE_LOADING } from './enum/mutationsEnum'

export default {
	[ACTIONS_BEGIN_LOADING]({ commit, dispatch, state, rootState, rootGetters },{ isLoading = true }){
		isLoading && commit(ADD_ONCE_LOADING,{ })
	},
	[ACTIONS_FINISH_LOADING]({ commit, dispatch, state, rootState, rootGetters },{ isLoading = true }){
		isLoading && commit(DEL_ONCE_LOADING,{ })
	}
}
