<template>
  <div class="ensure-pay">
    <div class="amount">￥{{money}}</div>
    <div class="account b-t-1" v-if='bankInfo'>
      <div class="key">付款账户</div>
      <div class="value" @click='openSelector'><img class='bank-icon' :src="bankInfo.icon" alt="银行icon"><span class="bank-info">{{bankInfo.bankName}}（尾号{{bankInfo.bankFourDigits}}）</span></div>
    </div>
    <div class="agree-pay" v-if='isNeedAgree'>
      <div class="input-area m-t-20">
        <div class="des">预留手机号：</div>
        <input type="text" class="input" v-model="telephone" placeholder="请输入银行预留手机号">
      </div>
      <div class="input-area b-t-1 pr100">
        <div class="des">验证码：</div>
        <input type="text" class="input" v-model="checkcode" placeholder="请输入验证码">
        <CheckCode @sendCode='sendCode'></CheckCode>
      </div>
      <!--绑卡协议-->
      <p class="protocal">请仔细阅读本绑卡协议信息，点击”支付“按钮表示你们同意遵守<span @click="toProtocal">《绑卡协议》</span></p>
    </div>
    <BaseButton text='立即支付' type='blue' mt='.25rem' @click.native='pay'></BaseButton>
    <BankSelector v-if='bankArr' :bank-arr='bankArr' :def-index='selectIndex' ref='bankSelector' @updateBank='updateBank'></BankSelector>
  </div>
</template>
<script>
import { BankSelector, CheckCode, BaseButton, } from '@/components/iqiyi/repayment';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import { checkTelephone } from '@/utils/helpers';
import { CARD_AGREEMENT } from '@/store/modules/bankCard/enum/gettersEnum';
import { GET_CARD_AGREEMENT } from '@/store/modules/bankCard/enum/actionsEnum';
import cookie from '@/utils/cookie';

export default {
  name: 'OrderPay',
  components: { BankSelector, CheckCode, BaseButton },
  data() {
    return {
      telephone: '',
      checkcode: '',
      money: null,
    };
  },
  computed: {
    ...mapGetters('repayment/OrderPay', ['bankInfo', 'isNeedAgree']),
    ...mapState('repayment/OrderPay', ['selectIndex', 'bankArr']),
    ...mapGetters({
      cardAgreement: CARD_AGREEMENT, // 绑卡协议链接url地址
    }),
  },
  methods: {
    // ...mapActions(['showToast']),
    ...mapActions({
      getCardAgreement: GET_CARD_AGREEMENT,
      showToast: 'showToast'
    }),
    ...mapActions('repayment/OrderPay', ['PayInitDataSubmit', 'willStartPay', 'getAgreementCheckCode', 'bindToThird', 'bindGuangFaBank']),
    ...mapMutations('repayment/OrderPay', ['SELECTED_BANK_SWITCH']),
    async toProtocal() {
      const telephone = this.telephone;
      const checkcode = this.checkcode;
      try {
        await this.getCardAgreement();
      } catch (err) {
        this.showToast({ text: '获取协议失败,请稍后重试' })
      };
      if (telephone) {
        sessionStorage.setItem('payTelCache', telephone);
      }
      if (checkcode) {
        sessionStorage.setItem('payCodeCache', checkcode);
      }
      const Token = cookie.get('sid');
      console.log(Token);
      this.$router.push({ name: 'contractDetail', query: { pdfUrl: this.cardAgreement, token: Token } });
      // this.$router.push({ path: '/contractList' });
    },
    // 跳转绑定广发
    async GoTobindGF() {
      const response = await this.bindGuangFaBank({
        callbackUrl: location.href.replace(/\?.*/, ''),
      });
      const retUrl = response.result;
      if (/https?:\/\//.test(retUrl)) {
        location.href = retUrl;
      } else {
        this.showToast({ text: '跳转失败，请稍后重试' });
        throw '跳转失败，请稍后重试';
      }
    },
    // 订单支付
    async pay() {
      if (this.isNeedAgree) {
        if (!this.checkcode) {
          this.showToast({ text: '请输入验证码' });
          return;
        }
        await this.bindToThird({ code: this.checkcode });
      }
      const { bankCode, phone, cardNo, isBindGF } = this.bankInfo;
      if (!isBindGF) { // 是否没绑定存管
        this.$store.dispatch('showConfirm', {
          text: '您还未绑定广发银行存管,是否绑定?',
          sureCb: this.GoTobindGF,
          cancelCb: () => {
            console.log('cancelCb');
            this.showToast({ text: '支付流程中断' }, { root: true });
          },
        });
        //throw 'not bind GuangFa';
        return;
      }
      await this.willStartPay({ repaymentListJson: this.repaymentListJson });
      sessionStorage.setItem('status', 200);
      this.$router.replace('/SucceedToPay');
    },
    sendCode(startCountDown) { //sendCode
      const telephone = this.telephone;
      if (!checkTelephone(telephone)) {
        this.showToast({ text: '请输入正确的手机号' });
        return;
      }
      this.getAgreementCheckCode({ telephone }).then(() => {
        startCountDown(); // 发送验证码
      });
    },
    openSelector() { //打开
      return; // 关闭功能
      this.$refs.bankSelector.$emit('show');
    },
    updateBank(v) { //更新
      //console.log(v, this.bankArr[v]);
      if (this.selectIndex === v) {
        return;
      }
      this.SELECTED_BANK_SWITCH(v);
      //单向流
      // this.$store.commit('OrderPay/SELECTED_BANK_SWITCH', v);
      // this.selectIndex = v;
    },
  },
  created() {
    const payTelCache = sessionStorage.getItem('payTelCache');
    const payCodeCache = sessionStorage.getItem('payCodeCache');
    if (payTelCache) {
      this.telephone = payTelCache;
      sessionStorage.removeItem('payTelCache');
    }
    if (payCodeCache) {
      this.checkcode = payCodeCache;
      sessionStorage.removeItem('payCodeCache');
    }
    const convertParams = JSON.parse(sessionStorage.getItem('repayJsonStr'));
    console.log(convertParams);
    try {
      this.money = convertParams.money;
      this.repaymentListJson = convertParams.repaymentListJson;
      this.PayInitDataSubmit({ money: this.money }).catch((err) => {
        console.log(err);
        this.$occurError(); // 跳转错误页
      });
    } catch (err) {
      this.showToast({ text: '请稍后重试', })
      // this.$router.replace('/');
      return;
    }
  },
};

</script>
<style lang="scss" scoped>
.ensure-pay {
  width: 100%;
  font-size: .15rem;
}

.agree-pay {
  width: 100%;
}

.protocal {
  font-size: .15rem;
  margin: .20rem .15rem;
  color: rgb(117, 117, 117);
  span {
    color: rgb(54, 142, 255);
  }
}

.amount {
  height: 1.2rem;
  line-height: 1.2rem;
  font-size: 0.36rem;
  color: #212121;
  text-align: center;
  background-color: #fff;
}

.account {
  height: 0.45rem;
  line-height: 0.45rem;
  padding: 0 0.4rem 0 0.16rem;
  color: #212121;
  background-color: #fff; //background: url(~@/assets/images/common/linkCellArrowRight@2x.png) right 0.15rem center/auto 0.15rem no-repeat, #fff;
  .key {
    float: left;
  }
  .value {
    float: right;
    height: 0.45rem; // padding-left: 0.5rem;
    position: relative;
  }
}

.bank-icon {
  height: .25rem; // position: absolute;
  // left: 0;
  // top: 50%;
  // margin-top: -.13rem;
}

.bank-info {
  vertical-align: super;
  margin-left: 0.1rem;
}

.b-t-1 {
  border-top: 1px solid #f3f3f3;
}

.pr100 {
  padding-right: pxToRem(100px);
}

.input-area {
  height: 0.45rem;
  line-height: 0.45rem;
  width: 100%;
  display: flex;
  flex-flow: row no-wrap;
  background-color: #fff;
  padding-left: .16rem;
  position: relative;
  .input {
    flex: 1;
    border: none;
    outline: none;
    min-width: 0;
    &::-webkit-input-placeholder {
      color: #C1C1C1;
    }
  }
  .des {
    color: #212121;
    padding-right: 0.1rem;
  }
}

// .check-code {
//   position: absolute;
//   width: 0.8rem;
//   height: 0.24rem;
//   line-height: 0.24rem;
//   right: 0.15rem;
//   top: 0.11rem;
//   border: 1px solid #0070FF;
//   color: #0070FF;
//   text-align: center;
//   font-size: .12rem;
//   border-radius: 0.12rem;
//   &.disabled {
//     border-color: #999;
//     color: #999;
//   }
// }

</style>
