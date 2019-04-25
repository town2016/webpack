
import { FETCH_SERVER } from '@/store/commonModules/Service/enum/actionEnum';
import { API_GET_PROCESS_INFO } from '@/api/h5Config/basicConfig';
import { GET_PROCESS_INFO } from './enum/action-types';
import { SET_PROCESS_INFO } from './enum/mutation-types';
import { SHOW_TOAST } from '@/store/commonModules/Toast/enum/actionsEnum';
import { CHECK_PERMISSION } from "@/store/h5processModules/common/enum/action-types";
import { GET_CONFIG } from "@/store/h5processModules/config/enum/action-types";
import router from '@/pages/h5process/router';

export default {
  async [GET_PROCESS_INFO]({ commit, dispatch }, params, { isLoading = false, isToast = false } = {}) {
    try {
      const data = await dispatch(FETCH_SERVER, {
        apiName: API_GET_PROCESS_INFO,
        config: { isLoading, isToast },
        params: { ...params },
        extraFetchConfig: {}
      }, { root: true });
      if(data && data.result){
        commit(SET_PROCESS_INFO, data.result);
        await dispatch(GET_CONFIG);
        let currentProcess = data.result.currentProcess;
        let nextProcess = data.result.nextProcess;
        localStorage.setItem('currentProcess',currentProcess);
        localStorage.setItem('nextProcess',nextProcess);
        let path = '';
        // login 登陆 //realNameAuth 实名 //credit 额度 //loan下单 //withdraw 提现 //home 首页
        if(currentProcess){
          switch (currentProcess) {
            case 'login':
              let nextProcess = data.result.nextProcess;
              let newPath = '';
              switch (nextProcess) {
                case 'realNameAuth':
                  newPath = 'basicDataIdentify';
                  break;
                case 'credit':
                  newPath = 'evaluateLimit';
                  break;
                default:
                  newPath = nextProcess;
              }
              path = newPath;
              break;
            case 'realNameAuth':
              path = 'basicDataIdentify';
              break;
            case 'credit':
              path = 'evaluateLimit';
              break;
            case 'loan':
              path = 'loan';
              break;
            case 'withdraw':
              path = 'withdraw';
              break;
            case 'home':
              path = 'home';
              break;
            default:
              path = currentProcess;
          }
          router.replace({ path: '/'+path });
        }
      }
    } catch (e) {
      console.log(e);
      if(e.status == 401){
        router.replace({ path: '/download'});
      }
    }
  }
};
