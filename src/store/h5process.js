import vue from 'vue';
import vuex from 'vuex';

import ErrorHandler from '@/store/commonModules/Error';
import Loading from '@/store/commonModules/Loading';
import Service from '@/store/commonModules/Service';
import Toast from '@/store/commonModules/Toast';
import Confirm from '@/store/commonModules/Confirm';
import Reference from '@/store/commonModules/Reference';

import Common from '@/store/h5processModules/common';
import Config from '@/store/h5processModules/config';
import Home from '@/store/h5processModules/home';
import Password from '@/store/h5processModules/password';
import Register from '@/store/h5processModules/register';
import SmsCode from '@/store/h5processModules/smsCode';
import login from '@/store/h5processModules/login';
import redirect from '@/store/h5processModules/redirect';

import repayment from '@/store/h5processModules/repayment';

import phoneAuth from '@/store/h5processModules/phoneAuth';
import identification from '@/store/h5processModules/identification';
import BankCard from '@/store/h5processModules/bankCard';
import EvaluateLimit from '@/store/h5processModules/evaluateLimit';
import Loan from '@/store/h5processModules/loan';
import Withdraw from '@/store/h5processModules/withdraw';
import bankManage from '@/store/h5processModules/bankManage';
// import middleWare from '@/utils/vuexMiddleWare'
import VueClipboard from 'vue-clipboard2';
VueClipboard.config.autoSetContainer = true;
vue.use(VueClipboard);
vue.use(vuex);
// middleWare(vuex.Store);
const store = new vuex.Store({
  modules: {
    redirect,
    ErrorHandler,
    Loading,
    Toast,
    Service,
    Confirm,
    Reference,
    Common,
    Config,
    Home,
    Password,
    Register,
    SmsCode,
    login,
    repayment,
    phoneAuth,
    identification,
    BankCard,
    Withdraw,
    EvaluateLimit,
    Loan,
    bankManage
  }
});

export default store;
