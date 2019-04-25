<template>
  <div class="container">
    <div class="withdrawTips">
      单次提现金额上限为
      <span>50000.00</span> 元
    </div>
    <template>
      <bank-card-panel class="m-t-20" :logo="defaultCard.logo" :name="defaultCard.bankname" :afterNo="defaultCard.afterNo">
      </bank-card-panel>
      <withdraw-box class="m-t-15" title="提现金额" :money="drawDepositInfo.no_cash_money?Number(drawDepositInfo.no_cash_money).toFixed(2):'0'" money-state="">
        预计10分钟到账，
        <span class="tip-red">剩余{{(drawDepositInfo.loan_amt-drawDepositInfo.cash_money-drawDepositInfo.no_cash_money)>0?(drawDepositInfo.loan_amt-drawDepositInfo.cash_money-drawDepositInfo.no_cash_money).toFixed(2):'0.00'}}元</span>
      </withdraw-box>
      <p class="extra-entry">
        <span @click="modifyPassword">忘记交易密码？</span>
        <span @click="unLocking">交易密码被锁定？</span>
      </p>
      <div class="btn-box">
        <mt-button @click.native="nextStep" :disabled="!drawDepositInfo.no_cash_money || drawDepositInfo.no_cash_money == 0 || defaultCard.afterNo === '' || isWithdrawing" type="primary" class="btn-next">确认提现</mt-button>
      </div>
    </template>
    <div v-if="isWithdrawing" class="withdrawing-tips-con">
      <div class="withdrawing-tips">
        <img :src="require('@/assets/images/withdraw/withdrawing.gif')" class="withdrawing-tips-img">
        <div class="withdrawing-tips-tips1">提现处理中</div>
        <div class="withdrawing-tips-tips2">请5-10分钟后重试</div>
      </div>
    </div>
  </div>
</template>
<script>
import BankCardCell from '@/components/iqiyi/bankCard/BankCardCell';
import { HintPanel, MessagePanel, BankCardPanel, WithdrawBox } from '@/components/iqiyi/withdraw';
import { MessageBox, Indicator, Toast } from 'mint-ui';
import { mapActions, mapGetters, mapState } from 'vuex';
import { GET_WITHDRAW_DEPOSITINFO, SUBMIT_WITHDRAW_DEPOSITINFO, MODIFY_PASSWORD, UN_LOCKING, } from '@/store/modules/withdraw/enum/actionsEnum';
import { WITHDRAW_DEPOSITINFO } from '@/store/modules/withdraw/enum/gettersEnum';
import { GET_FIRST_REPAY_CARD } from '@/store/modules/bankCard/enum/actionsEnum';
import { SHOW_TOAST } from '@/store/commonModules/Toast/enum/actionsEnum';
import { BANK_CARD } from '@/store/modules/bankCard/enum/gettersEnum';
import storage from '@/utils/storage';
import allBankList from '@/utils/bankList';
import cookie from '@/utils/cookie';

export default {
  name: "Edit", // 选择银行卡，金额等
  data() {
    return {
      isWithdrawing: false,
      gfUrl: storage.read('gfUrl') || '',
    };
  },
  async created() {
    // 将token存入cookie
    // if (this.$route.query.token) {
    //   cookie.set("sid", this.$route.query.token, 3);
    // } else {
    //   if (!cookie.get("sid")) {
    //     Toast("获取token失败！");
    //     window.setTimeout(() => {
    //       window.history.go(-1);
    //     },3000);
    //     return;
    //   }
    // }
    this.isWithdrawing = false;

    // 获取提现信息
    this.getWithdrawInfo()

    // 获取银行卡信息
    this.getFirstRepayCard()

    // 将跳转回华润的连接存入缓存
    if (location.href.split('?') && location.href.split('?')[1]) {
      let huaRunLoanObjInfo = {};
      let urlArray = location.href.split('?')[1].split('&');
      let midObj = {};
      urlArray.map((item) => {
        let midItem = item.split('=');
        midObj[midItem[0]] = decodeURIComponent(midItem[1]);
      })
      // 兼容从绑卡页面进提现页面
      if (midObj.returnUrl) {
        huaRunLoanObjInfo.returnUrl = midObj.returnUrl; // 华润导航条页面链接
        huaRunLoanObjInfo.token = midObj.token; // 华润导航条页面链接
        storage.write("huaRunLoanObjInfo", JSON.stringify(huaRunLoanObjInfo));
      }
    }
  },
  components: {
    MessagePanel,
    BankCardCell,
    HintPanel,
    BankCardPanel,
    WithdrawBox
  },
  computed: {
    ...mapGetters({
      drawDepositInfo: WITHDRAW_DEPOSITINFO,
      defaultCard: BANK_CARD,
    })
  },
  watch: {
    drawDepositInfo(newVal) {
      if (newVal.status != 1) {
        // storage.delete("gfUrl");
        return
      }
      if (!this.gfUrl) {
        this.isWithdrawing = true
        return
      }
      MessageBox({
        title: "提示",
        message: "如交易密码错误，请前往广发银行页面重新输入。交易密码成功后，预计5-10分钟即可到账。",
        closeOnClickModal: false,
        confirmButtonText: "重新输入"
      }).then(action => {
        window.location.href = this.gfUrl;
      });

    },
  },
  beforeDestroy() {
    // this.tips({ text:'',duration:0 })
  },
  mounted() {

  },
  methods: {
    ...mapActions({
      tips: SHOW_TOAST
    }),
    ...mapActions({
      getWithdrawInfo: GET_WITHDRAW_DEPOSITINFO,
      submitWithdrawInfo: SUBMIT_WITHDRAW_DEPOSITINFO,
      modifyPasswording: MODIFY_PASSWORD,
      unLock: UN_LOCKING,
      getFirstRepayCard: GET_FIRST_REPAY_CARD,
    }),
    async nextStep() {
      let submitMoney = Number(this.drawDepositInfo.no_cash_money || 0).toFixed(2);
      let midUnSubmitMoney = this.drawDepositInfo.loan_amt - this.drawDepositInfo.cash_money - this.drawDepositInfo.no_cash_money;
      let unSubmitMoney = midUnSubmitMoney > 0 ? midUnSubmitMoney : '';
      let applyId = this.drawDepositInfo.applyId;
      let params = {
        applyId,
        productType: 'fast_loan',
        bankAccountNo: this.defaultCard.cardno,
        callBackUrl: location.origin + `/withdrawResult?submitMoney=${submitMoney && Number(submitMoney).toFixed(2)},${unSubmitMoney && Number(unSubmitMoney).toFixed(2)}`,
        money: submitMoney,
      }
      // console.log(params); return;
      this.submitWithdrawInfo(params);
    },
    async modifyPassword() {
      if (this.isWithdrawing) {
        return;
      }
      let params = {
        callbackUrl: window.location.href.split('?')[0],
      }
      // console.log(params); return;
      this.modifyPasswording(params);
    },
    async unLocking() {
      if (this.isWithdrawing) {
        return;
      }
      let params = {
        callbackUrl: window.location.href.split('?')[0],
      }
      // console.log(params); return;
      this.unLock(params);
    },
    changeCard() {
      // 切换银行卡
      this.$router.push({
        name: 'bankCardList',
        query: {
          token: this.$route.query.token,
          url: window.location.href
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.container {
  position: relative;
  width: 100%;
  display: block;
  .withdraw-info {
    border-radius: pxToRem(10);
    margin: pxToRem(15) pxToRem(16);
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: pxToRem(15);
  }
  .withdraw-box {
    position: relative;
    overflow: hidden;
  }
  .withdrawTips {
    color: red;
    text-align: center;
    margin: 0.1rem 0 -0.1rem 0;
    font-size: 0.14rem;
  }
}

.yen {
  font-family: Arial;
}

.card-info {
  background: white;
  display: flex;
  align-items: center;
  padding: pxToRem(16);
}

.amount-layout {
  border-bottom: 1px solid #e7e7e7;
  padding: pxToRem(14) 0 pxToRem(9) 0;
}

.tip-red {
  color: #ea3e44;
}

.btn-box {
  padding: pxToRem(15);
  position: relative;
  margin-top: 20px;
}

.btn-next {
  border-radius: pxToRem(44);
  height: 0.45rem;
  background: linear-gradient(to bottom, #0c7ee8, #0e87fd);
  background: -webkit-linear-gradient(
    bottom,
    #0c7ee8,
    #0e87fd
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    bottom,
    #0c7ee8,
    #0e87fd
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    bottom,
    #0c7ee8,
    #0e87fd
  ); /* Firefox 3.6 - 15 */
  width: 100%;
}
.warn-message {
  padding: pxToRem(5) 0;
  color: #fd734c;
  background: #f5e4df;
}
.bottomModal {
  width: 100%;
  height: 300px;
  .modalTittle {
    display: flex;
    justify-content: row;
    justify-content: space-between;
    align-items: center;
    height: 0.45rem;
    border-bottom: 0.5px solid rgb(231, 231, 231);
    .cancel {
      font-size: 0.15rem;
      color: rgb(54, 142, 255);
      margin-left: 0.15rem;
    }
    .tittle {
      text-align: center;
      font-size: 0.16rem;
      color: rgb(33, 33, 33);
    }
    .ensure {
      font-size: 0.15rem;
      color: rgb(54, 142, 255);
      margin-right: 0.15rem;
    }
  }
  .content {
    position: relative;
    .select {
      position: absolute;
      right: 0.15rem;
      top: 0.05rem;
    }
  }
  .scroller {
    margin-top: 0.45rem;
  }
}
.extra-entry {
  text-align: right;
  font-size: 12px;
  line-height: 20px;
  color: #26a2ff;
  padding-right: 0.1rem;
}
.withdrawing-tips-con {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  line-height: 6rem;
  font-size: 14px;
}
.withdrawing-tips {
  width: 1.6rem;
  height: 1.6rem;
  overflow: hidden;
  border-radius: 0.1rem;
  background-color: white;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.withdrawing-tips-img {
  width: 1.2rem;
  display: block;
  margin: 0.1rem auto 0;
}
.withdrawing-tips-tips1 {
  line-height: 0.2rem;
  font-weight: bold;
  color: #26a2ff;
  font-size: 16px;
}
.withdrawing-tips-tips2 {
  line-height: 0.24rem;
  font-size: 12px;
}
</style>
