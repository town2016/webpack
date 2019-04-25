<template>
  <div class="container">
    <!-- <navigation-bar index=4></navigation-bar> -->

    <StatusTips v-if="drawDepositInfo.status == 1 || drawDepositInfo.status == 2 || drawDepositInfo.status == 10"
                :showImg="require('@/assets/h5processImages/evaluateLimit/withdrawing01@2x.png')"
                tips="提现中" info="" button="刷新" @statusClick="getWithdrawInfo">
      <template slot='info'>
        <p class="evaluating-info">1.若已成功提交，预计10分钟到账银行卡</p>
        <p class="evaluating-info">2.若未提交，预计5分钟后可重新提现</p>
        <p class="evaluating-info">3.若存管账户被锁，点击这里<span style="color: #368EFF;" @click="unLocking">解锁账户</span></p>
      </template>
    </StatusTips>

    <StatusTips v-if="drawDepositInfo.status == 5" :showImg="require('@/assets/h5processImages/evaluateLimit/eval-info@2x.png')"
                tips="已过期" button="返回首页" @statusClick="toHome"></StatusTips>

    <StatusTips v-if="drawDepositInfo.status == 6" :showImg="require('@/assets/h5processImages/evaluateLimit/eval-info@2x.png')"
                tips="放款成功" button="返回首页" @statusClick="toHome"></StatusTips>

    <app-down-load class="app-download" v-if="baseConfig.isAdvertEnabled" :downloadUrl="baseConfig.downloadUrl" />

  </div>
</template>

<script>
import NavigationBar from '@/components/h5process/givingCredit/NavigationBar';
import BaseButton from '@/components/h5process/base/BaseButton';
import StatusTips from '@/components/h5process/loan/StatusTips';
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
  name: "withdrawResult",
  data() {
    return {
      baseConfig: {},
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
    StatusTips,
    AppDownLoad,
  },
  computed: {
    ...mapGetters({
      drawDepositInfo: WITHDRAW_DEPOSITINFO,
      bankCard: BANK_CARD,
    })
  },
  watch: {
    drawDepositInfo(newVal, oldVal) {
      if (newVal.status == 0) {
        // 获取银行卡信息
        this.$router.replace('/withdraw');
        return;
      }
      if (newVal.status == 6) {
        this.$router.replace('/home');
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
      let params = {
        oid: this.drawDepositInfo.oid,
        bankAccountNo: this.bankCard.cardno,
        callBackUrl: window.location.href.split('?')[0],
        money: this.drawDepositInfo.no_cash_money,
      };
      // console.log(params); return;
      this.submitWithdrawInfo(params);
    },
    async modifyPassword() {
      if (this.isWithdrawing) {
        return;
      }
      let params = {
        callbackUrl: window.location.href.split('?')[0],
      };
      // console.log(params); return;
      this.modifyPasswording(params);
    },
    async unLocking() {
      let params = {
        callbackUrl: window.location.href.split('?')[0],
      };
      // console.log(params); return;
      this.unLock(params);
    },
    toHome() {
      this.$router.push("/home");
    },
    toLoan() {
      this.$router.push("/loan");
    },
    async downApp() {
      window.location.href = this.baseConfig.downloadUrl;
    },
  },
  async mounted() {
    this.baseConfig = await this.getConfig();
    this.getWithdrawInfo();
  },
  created() {
    window.addEventListener('webkitvisibilitychange', () => {
      this.getWithdrawInfo();
    });
  },
  destroyed() {
    window.removeEventListener('webkitvisibilitychange', () => {});
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
  background-color: #fff;
  padding-bottom: .75rem;
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

.app-download {
  position: fixed;
  bottom: 0.2rem;
  left: 0;
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
</style>
