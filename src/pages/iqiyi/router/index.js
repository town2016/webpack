import Vue from 'vue';
import Router from 'vue-router';

// 开通存管
const OpenAccount = () => import('@/pages/iqiyi/openAccount/openAccount');

// 银行卡
const BankCardList = () => import('@/pages/iqiyi/bankCard/bankCardList');
const AddBankCard = () => import('@/pages/iqiyi/bankCard/addBankCard');
const BankCardInfo = () => import('@/pages/iqiyi/bankCard/bankCardInfo');
const SupportBankList = () => import('@/pages/iqiyi/bankCard/supportBankList');

// 授权页
const GotoAccredit = () => import('@/pages/iqiyi/authorization/gotoAccredit');

// 合同列表
const ContractList = () => import('@/pages/iqiyi/contract/contractList');
const ContractDetail = () => import('@/pages/iqiyi/contract/contractDetail');

// 提现
const Withdraw = () => import('@/pages/iqiyi/withdraw/withdraw.vue');
const WithdrawResult = () => import('@/pages/iqiyi/withdraw/withdrawResult.vue');

Vue.use(Router);

const routes = [
  {
    path: '/bankCardList',
    name: 'bankCardList',
    component: BankCardList,
    meta: { title: '银行卡列表', requireAuth: false }
  },
  {
    path: '/addBankCard',
    name: 'addBankCard',
    component: AddBankCard,
    meta: { title: '添加银行卡', requireAuth: false }
  },
  {
    path: '/bankCardInfo',
    name: 'bankCardInfo',
    component: BankCardInfo,
    meta: { title: '银行卡详情', requireAuth: false }
  },
  {
    path: '/supportBankList',
    name: 'supportBankList',
    props: true,
    component: SupportBankList,
    meta: { title: '支持银行', requireAuth: false }
  },
  {
    path: '/contractList',
    name: 'contractList',
    component: ContractList,
    meta: { title: '合同列表', requireAuth: false }
  },
  {
    path: '/contractDetail',
    name: 'contractDetail',
    component: ContractDetail,
    meta: { title: '合同详情', requireAuth: false }
  },
  {
    path: '/gotoAccredit',
    name: 'gotoAccredit',
    component: GotoAccredit,
    meta: { title: '跳转授权', requireAuth: false }
  },
  {
    path: '/openAccount',
    name: 'openAccount',
    component: OpenAccount,
    meta: { title: '开通存管', requireAuth: false }
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    component: Withdraw,
    props: true,
    meta: { title: '提现', keepAlive: false, requireAuth: false }
  },
  {
    path: '/withdrawResult',
    name: 'withdrawResult',
    component: WithdrawResult,
    props: true,
    meta: { title: '申请成功', keepAlive: false, requireAuth: true }
  },
  {
    path: '/BillDetailOperate',
    name: 'BillDetailOperate',
    component: () =>
      import(/* webpackChunkName: "BillDetailOperate" */ '@/pages/iqiyi/repayment/BillDetailOperate.vue'),
    meta: { title: '账单', keepAlive: false, requireAuth: true }
  },
  {
    path: '/EarlyBillsRepay/:order',
    name: 'EarlyBillsRepay',
    component: () =>
      import(/* webpackChunkName: "EarlyBillsRepay" */ '@/pages/iqiyi/repayment/EarlyBillsRepay.vue'),
    meta: { title: '提前结清', keepAlive: false, requireAuth: false }
  },
  {
    path: '/SucceedToPay',
    name: 'SucceedToPay',
    component: () =>
      import(/* webpackChunkName: "EarlyBillsRepay" */ '@/pages/iqiyi/repayment/SucceedToPay.vue'),
    meta: { title: '还款成功', keepAlive: false, requireAuth: false }
  },
  {
    path: '/OrderPay',
    name: 'OrderPay',
    component: () =>
      import(/* webpackChunkName: "EarlyBillsRepay" */ '@/pages/iqiyi/repayment/OrderPay.vue'),
    meta: { title: '还款支付', keepAlive: false, requireAuth: false }
  },
  {
    path: '/error/:origin',
    name: 'ErrorPage',
    component: require('@/pages/iqiyi/common/ErrorPage.vue').default,
    meta: { title: '出错', keepAlive: false, requireAuth: false }
  }
];

export default new Router({
  mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash',
  linkActiveClass: 'active', // 激活路由添加 'active' class名称
  routes: routes
});
