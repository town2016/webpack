<template>
  <div class="bank-manage-warpprer" :class="{overlay:notSupportBank}" v-if='isInited'>
    <BankCell v-if='bankComponentInfo' :bankInfo='bankComponentInfo' :selected='true'></BankCell>
    <p class="tip" v-if='!notSupportBank'>银行预留手机号：{{telephone}}</p>
    <div class="boundary-line"></div>
    <div class="input-area pr100" v-if='isNeedSms'>
      <div class="des">短信验证码：</div>
      <input type="text" class="input" v-model="checkcode" placeholder="请输入验证码">
      <CheckCode class="check-code" @sendCode='sendCode' />
    </div>
    <div class="button-container" v-if='notSupportBank'>
      <TipNavigation v-if='globalConfig&&globalConfig.isAdvertEnabled' class="tip-nav"
                     text='暂不支持该银行，请下载App更换银行卡' :showArrow='false' />
      <customButton v-if='globalConfig&&globalConfig.isAdvertEnabled' text='下载App更换银行卡'
                    type='yellow' @click.native='trunInApp' />
      <customButton text='查看支持银行' type='white' mt='0.1rem' @click.native="checkSupportedBanks" />
    </div>
    <div class="button-container" v-else>
      <customButton text='完成' :type='btnType' @click.native='complete'></customButton>
      <p class="protocal">请仔细阅读本绑卡协议信息，点击“完成”按钮表示同意遵守<span @click="toProtocal">《绑卡协议》</span></p>
    </div>
  </div>
</template>
<script>
//import HomeTips from '@/components/home/homeTips';
import TipNavigation from '@/components/h5process/repayment/TipNavigation';
import customButton from '@/components/h5process/base/BaseButton';
import BankCell from '@/components/h5process/bankCardManage/BankCell.vue';
import CheckCode from '@/components/h5process/bankCardManage/CheckCode.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'UserBankAdd',
  components: { customButton, BankCell, CheckCode, TipNavigation },
  data() {
    return {
      // bankInfo: {
      //   name: '建设',
      //   idCard: '1234123412341234'
      // },
      checkcode: "",
      hasGotCheckCode: false, // 已经获取过验证码
      globalConfig: null,
      isInited: false,
    };
  },
  computed: {
    ...mapGetters('bankManage/userBankAdd', ['bankInfo', 'notSupportBank']),
    telephone() {
      const bankInfo = this.bankInfo;
      return bankInfo ? bankInfo.phone : '***********';
    },
    bankComponentInfo() {
      const bankInfo = this.bankInfo;
      return bankInfo ? {
        name: bankInfo.bankname,
        idCard: bankInfo.cardno
      } : null
    },
    // 是否需要发送短信
    isNeedSms() {
      const bankInfo = this.bankInfo;
      const notSupportBank = this.notSupportBank;
      if (notSupportBank) {
        return false;
      }
      return bankInfo ? bankInfo.thirdQueryBind === false : null;
    },
    btnClickabled() {
      const hasCheckCode = !!this.checkcode; // 验证阿信息是否存在
      const hasGotCheckCode = this.hasGotCheckCode; // 已经获取过验证码
      const isNeedSms = this.isNeedSms;
      return isNeedSms ? (hasCheckCode && hasGotCheckCode ? true : false) :
        true;
    },
    btnType() {
      return this.btnClickabled ? 'yellow' : 'gray';
    },
  },
  methods: {
    ...mapActions(['showToast', 'GET_CONFIG']),
    ...mapActions('bankManage/userBankAdd', [
      'getCurrentBankInfo',
      'getSmsCode',
      'comfirmBindCard',
      'getCardAgreement'
    ]),
    async trunInApp() {
      console.log('app引流');
      // try {
      //   const { downloadUrl } = await this.GET_CONFIG();
      //   location.href = downloadUrl;
      // } catch (err) {
      //   this.showToast({ text: '跳转失败,请稍后重试' });
      // }
      const { downloadUrl } = this.globalConfig;
      location.href = downloadUrl;
    },
    checkSupportedBanks() {
      this.$router.push('/supportBanksQuery');
    },
    async complete() {
      if (!this.btnClickabled) {
        if (!this.hasGotCheckCode) {
          this.showToast({ text: '请先获取短信验证码' });
        } else if (!this.checkcode) {
          this.showToast({ text: '请输入短信验证码' });
        }
        return;
      }
      //临时方案
      const { result = {} } = await this.comfirmBindCard({ smsCode: this.checkcode });
      //接口返回跳转链接
      const { confirmBindCardCallBackUrl = "" } = result
      //优先页面的fromurl
      const fromFullPath = this.$route.query.fromFullPath ||
        confirmBindCardCallBackUrl;

      if (fromFullPath) {
        //有协议开头
        fromFullPath.indexOf('://') > -1 ?
          (window.location.href = confirmBindCardCallBackUrl) :
          (this.$route.push(fromFullPath))
      } else {
        history.go(-1);
      }
    },
    async toProtocal() {
      try {
        const cardAgreementUrl = await this.getCardAgreement();
        this.$router.push({ path: '/contractDetail', query: { pdfUrl: cardAgreementUrl } });
      } catch (err) {
        console.log(err);
        this.showToast({ text: '获取协议失败,请稍后重试' })
      }
    },
    async sendCode(startCountDown) { //sendCode
      if (this.errText) { // 初始化失败，则不能获取验证码
        this.showToast({ text: this.errText });
        return;
      }
      try {
        await this.getSmsCode();
        this.hasGotCheckCode = true;
        startCountDown(); // 发送验证码
      } catch (err) {
        console.log(err)
        this.showToast({ text: '获取验证码失败,请稍后重试' })
      }
      // setTimeout(() => {
      //   this.hasGotCheckCode = true;
      //   startCountDown(); // 发送验证码
      // }, 1000);
      //   this.getAgreementCheckCode({ telephone }).then(() => {
      //     startCountDown(); // 发送验证码
      //   });
    },
    async getGlobalConfig(needToast) {
      if (this.globalConfig) {
        return this.globalConfig;
      }
      try {
        this.globalConfig = await this.GET_CONFIG();
      } catch (err) {
        this.showToast({ text: '获取配置失败，请稍后重试' });
      }
    }
  },
  created() {
    this.errText = null; // 储存初始化失败的错误信息
    // 初始化
    this.getCurrentBankInfo().then((bankInfo) => {
      if (!bankInfo) { // 未发现银行卡
        this.showToast({ text: '请走正常流程,先绑定广发存管;如果已经绑定,则联系客服' });
        // this.$occurError(err,'/home'); // 直接跳转到首页
      } else {
        this.isInited = true;
      }
    }).catch((err) => { // 初始化页面,失败
      if (err.isActionError) { // actions内部可预知的违规操作
        const desc = err.desc;
        this.errText = desc;
        this.showToast({ text: desc });
        // this.$occurError(err,'/home'); // 直接跳转到首页
      } else { // 不可预知的错误(网络错误等)
        this.$occurError(err);
      }
    });
    this.getGlobalConfig(false);
    // bankInfo = filterBankByKey('民生');
    // this.bankBanner = `url(${bankInfo.img})`;
    // this.bankName = bankInfo.fullName;
    // console.log(this.bankBanner)
  },
  // mounted() {},
};
</script>
<style lang="scss" scoped>
// 主题样式
@import '~@/assets/styles/h5process/theme.scss';

.bank-manage-warpprer {
  width: 100%;
  font-size: .16rem;
  color: #212121;
  background-color: #fff;

  &.overlay {
    padding-top: .25rem;
  }
}

.tip {
  line-height: .53rem;
  font-size: .13rem;
  color: #212121;
  text-align: left;
  padding-left: .15rem;
  font-size: .15rem;
}

.boundary-line {
  background-color: #f4f4f4;
  height: .15rem;
}

.button-container {
  margin-top: .3rem;
  width: 100%;
}

.input-area {
  height: 0.45rem;
  line-height: 0.45rem;
  width: 100%;
  display: flex;
  flex-flow: row no-wrap;
  background-color: #fff;
  overflow: hidden;
  border-bottom: 1px solid #E7E7E7;
  padding-left: .16rem;
  position: relative;

  .input {
    flex: 1;
    border: none;
    outline: none;
    min-width: 0;
    height: 0.45rem;
    padding: 0;

    &::-webkit-input-placeholder {
      color: #C1C1C1;
    }
  }

  .des {
    color: #212121;
    padding-right: 0.1rem;
    height: 0.45rem;
  }
}

.b-t-1 {
  border-top: 1px solid #E7E7E7;
}

.pr100 {
  padding-right: pxToRem(100px);
}

.protocal {
  font-size: .15rem;
  margin: .20rem .15rem;
  color: rgb(117, 117, 117);

  span {
    color: rgb(54, 142, 255);
  }
}

.tip-nav {
  position: fixed !important;
  top: 0;
  z-index: 888;
  left: 0;
  width: 100%;
}

.check-code {
  background-color: $goldThemeColor!important;
  color: #212121!important;
  &.disabled {
    border: none !important;
  }
}
</style>
