import cookie from '@/utils/cookie';
import vueRouter from "@/pages/h5process/router";
import {CHECK_PERMISSION} from './enum/action-types';
import {GET_PROCESS_INFO} from "@/store/h5processModules/redirect/enum/action-types";

export default {
  // 检查当前是否有访问路由的权限
  async [CHECK_PERMISSION]({dispatch}) {
    let pagePermissions = {
      registerPermission: ['register', 'protocolRegister'],
      loginPermission: ['login', 'forgetPwd'],
      realNameAuthPermission: ['basicDataIdentify'],
      creditPermission: ['evaluateLimit','basicDataIdentify','loan','loanInfo','loanResult', 'baseInfo', 'faceIdentify', 'phoneAuth','webview', 'changeServicePwd', 'addBankCard'],
      loanPermission: ['loan','loanInfo','loanResult', 'baseInfo', 'faceIdentify', 'phoneAuth', 'webview','changeServicePwd','gotoAccredit','addBankCard','supportBanksQuery'],
      withdrawPermission: ['withdraw','withdrawResult','home','billDetailSearch', 'orderPay/normal','orderPay/early', 'repayDetail/normal','repayDetail/early', 'succeedToPay'],
      homePermission: ['home', 'billDetailSearch', 'orderPay/normal','orderPay/early', 'repayDetail/normal','repayDetail/early', 'succeedToPay', 'basicDataIdentify']
    };

    vueRouter.beforeEach((to, from, next) => {
      if (to.matched.some(res => res.meta.requireAuth)) { // 判断是否需要登录权限
        if (cookie.get('sid') !== '') { // 判断是否登录
          let currentProcess = localStorage.getItem('currentProcess')||'';
          let nextProcess = localStorage.getItem('nextProcess')||'';
          if (currentProcess == 'login'){
            currentProcess = nextProcess;
          }
          let channelPermission = JSON.parse(localStorage.getItem('channelPermission')||'[]');
          if(channelPermission.includes('loan')){
            let homePermission = ['home', 'billDetailSearch', 'orderPay/normal','orderPay/early', 'repayDetail/normal','repayDetail/early', 'succeedToPay', 'basicDataIdentify'];
            pagePermissions.homePermission = homePermission.concat(pagePermissions.loanPermission);
          }
          if (currentProcess!='' && pagePermissions[currentProcess + 'Permission'].includes(to.path.substr(1))) {
            next();
          } else {
            dispatch(GET_PROCESS_INFO);
          }
        } else { // 没登录则跳转到登录界面
          next({path: '/login'});
        }
      } else {
        next();
      }
    });
  }
};
