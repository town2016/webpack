export default {
  bankCard: {}, // 首张银行卡
  notBankCard: {},
  bankCardList: [], // 银行卡列表
  supportBankList: [], // 支持的银行卡列表
  legalInfo: {}, // 合规相关信息
  authorizationData: { // 授权相关信息
    amount: '',
    date: ''
  },
  payType: 0, // 支付开关
  channel: 2, // 存管支持银行列表的渠道号：1-连连 2-宝付
  isThirdBind: true, // 是否已绑定过第三方存管
  smsCodeSuccess: false, // 是否已发送短信验证码，
  cardAgreement: '',
  bindCardCallbackUrl: ''
}