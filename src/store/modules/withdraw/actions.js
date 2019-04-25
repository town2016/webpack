import { GETWITHDRAWDEPOSITINFO, WITHDRWADEPOSIT, ISBINDTHIRD, SETPAYPASSWORD, UNLOCKACCOUNT } from "@/api/config/withdrawConfig"
import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum'
import { QUERY_WITHDRAW_DEPOSIT_INFO_SUCCESS, QUERY_WITHDRAW_DEPOSIT_INFO_FAILD } from "./enum/mutationsEnum"
import { GET_WITHDRAW_DEPOSITINFO, SUBMIT_WITHDRAW_DEPOSITINFO, MODIFY_PASSWORD, UN_LOCKING } from "./enum/actionsEnum"
import storage from '@/utils/storage';

export default {
  async [GET_WITHDRAW_DEPOSITINFO]({ commit, dispatch },{ isLoading = false,isToast = true } = {}) {
    try{
      const response = await dispatch(FETCH_SERVER,{  
        apiName:GETWITHDRAWDEPOSITINFO,
        config:{ isLoading,isToast },
        params:{},
        extraFetchConfig:{}
      },{ root: true })
      commit(QUERY_WITHDRAW_DEPOSIT_INFO_SUCCESS, response.result);
    }catch(error){
      console.log(error)
    }
  },
  
  async [SUBMIT_WITHDRAW_DEPOSITINFO]({ commit, dispatch },{ isLoading = true,isToast = true, applyId, productType, bankAccountNo, callBackUrl, money, } = {}) {
    try{
      const response = await dispatch(FETCH_SERVER,{  
        apiName:WITHDRWADEPOSIT,
        config:{ isLoading,isToast },
        params:{ applyId, productType, bankAccountNo, callBackUrl, money, },
        extraFetchConfig:{}
      },{ root: true })

      storage.write("gfUrl", response.result);
      window.location.href = response.result;
    }catch(error){
      console.log(error)
    }
  },

  async [MODIFY_PASSWORD]({ commit, dispatch },{ isLoading = true,isToast = true, callbackUrl } = {}) {
    try{
      const response = await dispatch(FETCH_SERVER,{  
        apiName: SETPAYPASSWORD,
        config:{ isLoading,isToast },
        params:{ callbackUrl },
        extraFetchConfig:{}
      },{ root: true })

      window.location.href = response.result;
    }catch(error){
      console.log(error)
    }
  },

  async [UN_LOCKING]({ commit, dispatch },{ isLoading = true,isToast = true, callbackUrl, } = {}) {
    try{
      const response = await dispatch(FETCH_SERVER,{  
        apiName: UNLOCKACCOUNT,
        config:{ isLoading,isToast },
        params:{ callbackUrl, },
        extraFetchConfig:{}
      },{ root: true })
      
      window.location.href = response.result;
    }catch(error){
      console.log(error)
    }
  },
};
