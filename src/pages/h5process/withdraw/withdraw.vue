<template>
  <div class="container">
    <navigation-bar index=4></navigation-bar>
    <div v-if="drawDepositInfo.status == 0">
      <p class="three-day-tips">请在3天内完成提现，过期需重新发起借款申请</p>
      <div class="withdraw-con">
        <p class="withdraw-title">提现金额（元）</p>
        <p class="withdraw-num">{{drawDepositInfo.no_cash_money}}</p>
        <p class="withdraw-tips">预计10分钟到账，以实际到账时间为准</p>
        <select-input :valueImg="bankCard.bankname" label="收款账户" :value="bankCard.bankname?bankCard.bankname + '(尾号'+ bankCard.cardno.substr(-4) + ')':''"
                      placeholder="请绑定储蓄卡" @click.native="bindCardUrl"
                      :showRightIcon="!bankCard.cardno">
        </select-input>
      </div>
      <base-button text='确认提现' :type='submitButtonState' mt='.15rem'
                   @click.native="nextStep"></base-button>
      <p class="un-locking">
        若存管账户被锁，点击这里<span style="color: #368EFF;" @click="unLocking">解锁账户</span>
      </p>
      <p class="change-bankcard" v-if="baseConfig.isAdvertEnabled">若需更换收款银行卡，请前往<span
              style="color: #368EFF;" @click="downApp">App更换</span></p>
    </div>
  </div>
</template>
<script>
import NavigationBar from '@/components/h5process/givingCredit/NavigationBar';
import BaseButton from '@/components/h5process/base/BaseButton';
import SelectInput from '@/components/h5process/loan/SelectInput';
import BankCardCell from '@/components/h5process/bankCard/BankCardCell';
import AppDownLoad from '@/components/h5process/common/AppDownload';
import { HintPanel, MessagePanel, BankCardPanel, WithdrawBox } from '@/components/h5process/withdraw';
import { mapActions, mapGetters } from 'vuex';
import {
  GET_WITHDRAW_DEPOSITINFO,
  SUBMIT_WITHDRAW_DEPOSITINFO,
  MODIFY_PASSWORD,
  UN_LOCKING,
  GET_BINDCARD_URL,
} from '@/store/h5processModules/withdraw/enum/actionsEnum';
import { WITHDRAW_DEPOSITINFO } from '@/store/h5processModules/withdraw/enum/gettersEnum';
import {
  GET_FIRST_REPAY_CARD,
  GET_BIND_BANK_CARD_HTTP_REQUEST,
} from "@/store/h5processModules/bankCard/enum/actionsEnum";
import {
  BANK_CARD
} from "@/store/h5processModules/bankCard/enum/gettersEnum";
import { SHOW_TOAST } from '@/store/commonModules/Toast/enum/actionsEnum';
import { GET_CONFIG } from "@/store/h5processModules/config/enum/action-types";

export default {
  name: "withdraw", // 提现
  data() {
    return {
      buttonClickable: true,
      baseConfig: {}
    };
  },
  components: {
    MessagePanel,
    BankCardCell,
    HintPanel,
    BankCardPanel,
    WithdrawBox,
    NavigationBar,
    SelectInput,
    BaseButton,
    AppDownLoad,
  },
  computed: {
    ...mapGetters({
      drawDepositInfo: WITHDRAW_DEPOSITINFO,
      bankCard: BANK_CARD,
    }),
    submitButtonState() {
      return this.buttonClickable ? 'yellow' : 'gray';
    },
  },
  watch: {
    drawDepositInfo(newVal, oldVal) {
      if (newVal.status != 0) {
        if (newVal.status != 6) {
          this.$router.replace('/withdrawResult');
        } else {
          this.$router.replace('/home');
        }
      }
    }
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
      getBindcardUrl: GET_BINDCARD_URL,
      getConfig: GET_CONFIG,
    }),
    async nextStep() {
      if (sessionStorage.getItem('ASign-GF') === '1') {
        // 从广发输密码返回
        this.tips({ text: '正在加载中...' });
        this.getWithdrawInfo();
      } else {
        let params = {
          oid: this.drawDepositInfo.oid,
          bankAccountNo: this.bankCard.cardno,
          callBackUrl: window.location.href.split('?')[0],
          money: this.drawDepositInfo.no_cash_money,
        };
        this.setEventListener();
        this.submitWithdrawInfo(params);
      }
    },
    async modifyPassword() {
      if (this.isWithdrawing) {
        return;
      }
      let params = {
        callbackUrl: window.location.href.split('?')[0],
      };
      this.modifyPasswording(params);
    },
    async unLocking() {
      let params = {
        callbackUrl: window.location.href.split('?')[0],
      };
      this.unLock(params);
    },
    toHome() {
      this.$router.replace("/home");
    },
    toLoan() {
      this.$router.replace("/loan");
    },
    async downApp() {
      window.location.href = this.baseConfig.downloadUrl;
    },
    setEventListener() {
      const fn = () => {
        this.getWithdrawInfo();
        window.onpageshow = null;
        document.onvisibilitychange = null;
      }
      if (window.onpageshow !== undefined) {
        window.onpageshow = fn;
      } else if (document.onvisibilitychange !== undefined) {
        document.onvisibilitychange = fn;
      } else {
        // 后备兼容方案 - 从广发输密码返回
        sessionStorage.setItem('ASign-GF', '1');
      }
    },
  },
  async mounted() {
    this.baseConfig = await this.getConfig();
    !(this.bankCard && this.bankCard.bankname) && this.getFirstRepayCard();
    this.getWithdrawInfo();
  },
  created() {
    sessionStorage.removeItem('ASign-GF');
  },
  destroyed() {
    window.onpageshow = null;
    document.onvisibilitychange = null;
  }
};
</script>
<style scoped lang="scss">
.container {
  // position: relative;
  // width: 100%;
  // display: block;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  flex: 1;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;

  .three-day-tips {
    font-size: 0.13rem;
    font-weight: 400;
    color: rgba(243, 63, 61, 1);
    text-align: center;
    background-color: rgba(255, 232, 232, 1);
    line-height: 0.3rem;
  }

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
  background: -webkit-linear-gradient(bottom,
    #0c7ee8,
    #0e87fd);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(bottom,
    #0c7ee8,
    #0e87fd);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(bottom,
    #0c7ee8,
    #0e87fd);
  /* Firefox 3.6 - 15 */
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

.withdraw-con {
  margin: 0.15rem;
  background-color: #fff;
}

.withdraw-title {
  font-size: 0.15rem;
  font-weight: 400;
  color: rgba(33, 33, 33, 1);
  line-height: 0.4rem;
  text-align: center;
}

.withdraw-num {
  font-size: 0.43rem;
  font-weight: 400;
  color: rgba(33, 33, 33, 1);
  line-height: 0.52rem;
  text-align: center;
}

.withdraw-tips {
  font-size: 0.12rem;
  font-weight: 400;
  color: rgba(117, 117, 117, 1);
  line-height: 0.2rem;
  text-align: center;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #e7e7e7;
}

.bottom-tips {
  position: fixed;
  left: 0;
  bottom: 0;
  font-size: 0.13rem;
  font-weight: 400;
  color: rgba(117, 117, 117, 1);
  line-height: 0.4rem;
  padding-bottom: 0.15rem;
  text-align: center;
  width: 100%;
  background-color: #fff;
}

.un-locking,
.change-bankcard {
  margin-top: 0.15rem;
  width: 100%;
  font-size: 0.13rem;
  font-weight: 400;
  color: rgba(117, 117, 117, 1);
  line-height: 0.2rem;
  text-align: center;
}

.change-bankcard {
  position: absolute;
  left: 0;
  bottom: 0.2rem;
}

.app-download-con {
  position: absolute;
  left: 0;
  bottom: 0.2rem;
  width: 100%;
}
</style>
