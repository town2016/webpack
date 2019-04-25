import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

//登录注册
const Register = () => import('@/pages/h5process/register/register');
const ProtocolRegister = () => import('@/pages/h5process/register/protocolRegister');
const Login = () => import('@/pages/h5process/login/login');
const ForgetPwd = () => import('@/pages/h5process/password/forgetPwd');

//实名
const BasicDataIdentify = () => import('@/pages/h5process/identification/basicDataIdentify');

//出额
const EvaluateLimit = () => import('@/pages/h5process/evaluateLimit/evaluateLimit');

//绑卡等
const GotoAccredit = () => import('@/pages/h5process/bankManage/gotoAccredit');
const SupportBanksQuery = () => import('@/pages/h5process/bankManage/supportBanksQuery');
const UserBankAdd = () => import('@/pages/h5process/bankManage/userBankAdd');


//借款
const Loan = () => import('@/pages/h5process/loan/loan');
const LoanInfo = () => import('@/pages/h5process/loan/loanInfo');
const LoanResult = () => import('@/pages/h5process/loan/loanResult');
const BaseInfo = () => import('@/pages/h5process/loan/baseInfo');
const PhoneAuth = () => import('@/pages/h5process/phoneAuth/phoneAuth');
const ChangeServicePwd = () => import('@/pages/h5process/password/changeServicePwd');
const FaceIdentify = () => import('@/pages/h5process/identification/faceIdentify');

//提现
const Withdraw = () => import('@/pages/h5process/withdraw/withdraw');
const WithdrawResult = () => import('@/pages/h5process/withdraw/withdrawResult');

//首页还款
const Home = () => import('@/pages/h5process/home/home');

//还款
const RepayDetail = () => import('@/pages/h5process/repayment/repayDetail');
const BillDetailSearch = () => import('@/pages/h5process/repayment/billDetailSearch');
const OrderPay = () => import('@/pages/h5process/repayment/orderPay');
const SucceedToPay = () => import('@/pages/h5process/repayment/succeedToPay');

//公共
const Redirect = () => import('@/pages/h5process/redirect/redirect');
const Download = () => import('@/pages/h5process/download/index');
const ContractDetail = () => import('@/pages/h5process/contract/contractDetail');
const Webview = () => import('@/pages/h5process/loan/webview');
const ErrorPage = () => import('@/pages/common/errorView/index');

const routes = [{
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: '注册', keepAlive: false, requireAuth: false }
  },
  {
    path: '/protocolRegister',
    name: 'ProtocolRegister',
    component: ProtocolRegister,
    meta: { title: '注册协议', keepAlive: false, requireAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录', keepAlive: false, requireAuth: false }
  },
  {
    path: '/forgetPwd',
    name: 'ForgetPwd',
    component: ForgetPwd,
    meta: { title: '忘记密码', keepAlive: false, requireAuth: false }
  },
  {
    path: '/basicDataIdentify',
    name: 'BasicDataIdentify',
    component: BasicDataIdentify,
    meta: { title: '实名认证', keepAlive: false, requireAuth: true }
  },
  {
    path: '/evaluateLimit',
    name: 'EvaluateLimit',
    component: EvaluateLimit,
    meta: { title: '评估额度', keepAlive: false, requireAuth: true }
  },
  {
    path: '/loan',
    name: 'Loan',
    component: Loan,
    meta: { title: '借款', keepAlive: false, requireAuth: true }
  },
  {
    path: '/loanInfo',
    name: 'LoanInfo',
    component: LoanInfo,
    meta: { title: '借款', keepAlive: false, requireAuth: true }
  },
  {
    path: '/addBankCard',
    name: 'UserBankAdd',
    component: UserBankAdd,
    meta: { title: '确认银行卡', keepAlive: false, requireAuth: true }
  },
  {
    path: '/loanResult',
    name: 'loanResult',
    component: LoanResult,
    meta: { title: '借款', keepAlive: true, requireAuth: true }
  },
  {
    path: '/baseInfo',
    name: 'BaseInfo',
    component: BaseInfo,
    meta: { title: '补充资料', keepAlive: false, requireAuth: true }
  },
  {
    path: '/webview',
    name: 'Webview',
    component: Webview,
    meta: { title: '借款协议', keepAlive: false, requireAuth: true }
  },
  {
    path: '/phoneAuth',
    name: 'PhoneAuth',
    component: PhoneAuth,
    meta: { title: '手机认证', keepAlive: false, requireAuth: true }
  },
  {
    path: '/changeServicePwd',
    name: 'ChangeServicePwd',
    component: ChangeServicePwd,
    props: true,
    meta: { title: '修改服务密码', keepAlive: false, requireAuth: true }
  },
  {
    path: '/faceIdentify',
    name: 'FaceIdentify',
    component: FaceIdentify,
    meta: { title: '人脸识别', keepAlive: false, requireAuth: true }
  },
  {
    path: '/withdraw',
    name: 'Withdraw',
    component: Withdraw,
    meta: { title: '提现', keepAlive: false, requireAuth: true }
  },
  {
    path: '/withdrawResult',
    name: 'WithdrawResult',
    component: WithdrawResult,
    meta: { title: '提现', keepAlive: false, requireAuth: true }
  },
  {
    path: '/gotoAccredit',
    name: 'GotoAccredit',
    component: GotoAccredit,
    meta: { title: '跳转授权', requireAuth: true }
  },
  {
    path: '/supportBanksQuery',
    name: 'SupportBanksQuery',
    // props: true,
    component: SupportBanksQuery,
    meta: { title: '银行查询', requireAuth: true }
  },
  {
    path: '/contractDetail',
    name: 'ContractDetail',
    component: ContractDetail,
    meta: { title: '合同详情', requireAuth: false}
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { title: '首页', keepAlive: false, requireAuth: true }
  },
  {
    path: '/repayDetail/:type',
    name: 'RepayDetail',
    component: RepayDetail,
    meta: { title: '还款明细', keepAlive: false, requireAuth: true }
  },
  {
    path: '/billDetailSearch',
    name: 'BillDetailSearch',
    component: BillDetailSearch,
    meta: { title: '还款明细', keepAlive: false, requireAuth: true }
  },
  {
    path: '/orderPay/:type',
    name: 'OrderPay',
    component: OrderPay,
    meta: { title: '支付', keepAlive: false, requireAuth: true }
  },
  {
    path: '/succeedToPay',
    name: 'SucceedToPay',
    component: SucceedToPay,
    meta: { title: '支付结果', keepAlive: true, requireAuth: true }
  },
  {
    path: '/redirect',
    name: 'Redirect',
    component: Redirect,
    meta: { title: '', keepAlive: false, requireAuth: false }
  },
  {
    path: '/download',
    name: 'Download',
    component: Download,
    meta: { title: '下载app', keepAlive: false, requireAuth: false }
  },
  {
    path: '/error/:origin',
    name: 'ErrorPage',
    component: ErrorPage,
    meta: { title: '出错', keepAlive: false, requireAuth: true }
  },
  {
    path: '/*',
    redirect: '/redirect'
  }
];

const vueRouter = new Router({
  mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash',
  linkActiveClass: 'active', // 激活路由添加 'active' class名称
  routes: routes
});

export default vueRouter;
