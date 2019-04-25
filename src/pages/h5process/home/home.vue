<template>
  <div class="container" :class="{hasTip: message!=''}">
    <top-tip :text="message" type="error"/>
    <div v-if="homeInfo.isSettled == true" class="loan">
      <p class="title fc-75 fz-px-13">我的可借额度（元）</p>
      <div class="amount fc-21 fz-px-44 font-din-regular">{{limitInfo.available}}</div>
      <div class="loan-btn fc-21 fz-px-16" :class="{ disabled: limitInfo.available == 0 }" @click="loan"
           v-show="showLoan">我要借款
      </div>
      <div class="repay-details fc-21" v-if="homeInfo.oid" @click="goRepaymentDetail">还款明细</div>
    </div>
    <div v-if="homeInfo.isSettled == false" class="repayment">
      <div class="repay-details fc-21" v-if="homeInfo.oid" @click="goRepaymentDetail">还款明细</div>
      <div class="repay-btn" :class="{'disabled': homeInfo.isDeducting || !homeInfo.havePayableBill }" @click="orderPay">
        <p class="fz-px-16 fc-21">一键还款</p>
      </div>
      <div class="repay-info">
        <div class="info-title fc-21 fz-px-13">本期应还款金额（元）</div>
        <div v-if="!homeInfo.havePayableBill" class="info-no-amount">本期已还清</div>
        <div v-else class="info-amount fc-21 fz-px-40">{{homeInfo.repaymentAbleAmount}}</div>
      </div>
      <div class="repay-bank fc-21">
        <bank-logo width=".2rem" height=".2rem" :according="homeInfo.bankName || ''"></bank-logo>
        <div class="bank-info">{{homeInfo.bankName}}（尾号{{homeInfo.bankCardNo&&homeInfo.bankCardNo.substr(-4)}}）</div>
        <div class="date" v-if="currentItemRepayDate">自动划扣日{{currentItemRepayDate}}</div>
      </div>
    </div>
    <div class="available-limit" v-if="homeInfo.isSettled == false && baseConfig.isAdvertEnabled">
      <div class="limit-title fc-75 fz-px-13">剩余可借额度(元)</div>
      <div class="limit fc-21 fz-px-44 font-din-regular">{{limitInfo.available}}</div>
      <div class="progress">
        <div class="progress-bar" :style="{ width: + availablePercent +'%' }"></div>
      </div>
    </div>
    <p v-if="homeInfo.isSettled == false && baseConfig.isAdvertEnabled" class="download-text fc-75 fz-px-13">{{amountText}}</p>
    <app-down-load v-if="baseConfig.isAdvertEnabled" :downloadUrl="baseConfig.downloadUrl"></app-down-load>
    <div v-if="!baseConfig.isAdvertEnabled" class="bg-home"></div>
  </div>
</template>

<script>

  import { MessageBox, Indicator } from 'mint-ui';
  import TopTip from '@/components/h5process/common/TopTip';
  import BankLogo from '@/components/BankLogo/index';
  import AppDownLoad from '@/components/h5process/common/AppDownload';
  import {mapActions, mapGetters, mapMutations} from 'vuex';
  import storage from '@/utils/storage';
  import {
    GET_HOME_INFO,
    GET_LIMIT_INFO,
    GET_LATEST_CREDIT_DEDUCT_RESULT
  } from "@/store/h5processModules/home/enum/action-types";
  import {HOME_INFO, LIMIT_INFO, LATEST_CREDIT_DEDUCT_RESULT} from "@/store/h5processModules/home/enum/getter-types";
  import {GET_CONFIG} from "@/store/h5processModules/config/enum/action-types";
  import {OPEN_TOAST_STATE} from "@/store/commonModules/Toast/enum/mutationsEnum";

  export default {
    name: "home",
    components: {
      TopTip,
      BankLogo,
      AppDownLoad
    },
    data() {
      return {
        interval: '',
        baseConfig: {}
      }
    },
    computed: {
      ...mapGetters('Reference', {
        baseOriginInfo: 'baseOriginInfo'
      }),
      ...mapGetters({
        homeInfo: HOME_INFO,
        limitInfo: LIMIT_INFO,
        latestCreditDeductResult: LATEST_CREDIT_DEDUCT_RESULT
      }),
      availablePercent() {
        return this.limitInfo.available * 100 / this.limitInfo.limit;
      },
      amountText() {
        return this.limitInfo && this.limitInfo.available == 0 ? '下载App可借剩余金额' : '下载App可借剩余金额，还能提高额度';
      },
      currentItemRepayDate() {
        return this.homeInfo && this.homeInfo.currentItemRepayDate ? this.homeInfo.currentItemRepayDate.substr(5, 5) : ''
      },
      showLoan() {
        if(this.baseConfig && this.baseConfig.channelPermission){
          if(this.baseConfig.channelPermission.length == 2 && this.baseConfig.channelPermission[1] == 'home'){
            return false;
          }else{
            return true;
          }
        }else{
          return true;
        }
      },
      message() {
        let status = this.latestCreditDeductResult.status;
        if (status == 1) {
          return '您有一笔还款申请已提交，预计需要30分钟更新还款结果';
        } else if (status == 3) {
          return this.latestCreditDeductResult.remark || '还款失败，请重新还款';
        } else {
          return '';
        }
      }
    },
    methods: {
      ...mapMutations('Toast', {
        openToast: OPEN_TOAST_STATE
      }),
      ...mapActions({
        getHomeInfo: GET_HOME_INFO,
        getLimitInfo: GET_LIMIT_INFO,
        getConfig: GET_CONFIG,
        getLatestCreditDeductResult: GET_LATEST_CREDIT_DEDUCT_RESULT
      }),
      goRepaymentDetail() {
        this.$router.push({path: '/billDetailSearch', params: {oId: this.homeInfo.oid}});
      },
      orderPay() {
        if (!this.homeInfo.isDeducting && this.homeInfo.havePayableBill) {
          this.$router.push({path: '/orderPay/normal'});
        }
      },
      loan() {
        if (this.limitInfo.code == 'out_of_date') {
          MessageBox.confirm('', {
            message: '您的额度已过期<br>请点击重新认证更新额度',
            title: '提示',
            confirmButtonText: '重新认证',
            cancelButtonText: '放弃'
          }).then(action => {
            if (action == 'confirm') { //确认的回调,跳转认证
              this.$router.push('/basicDataIdentify');
            }
          });
          return;
        }
        if (this.limitInfo.available > 0) {
          storage.delete('loadTakeDetail');
          this.$router.push({path: '/loanInfo'});
        }
      }
    },
    async mounted() {
      Indicator.open();
      this.getLimitInfo();
      await this.getHomeInfo();
      Indicator.close();
      this.getLatestCreditDeductResult();
      if(this.baseOriginInfo.token != ''){
        this.interval = setInterval(()=>{
          this.getLatestCreditDeductResult();
        },5000);
        this.intervalHome = setInterval(()=>{
          this.getLimitInfo();
          this.getHomeInfo();
        },30000);
      }else{
        window.clearInterval(this.interval);
        window.clearInterval(this.intervalHome);
      }
      this.baseConfig = await this.getConfig();
    },
    destroyed() {
      window.clearInterval(this.interval);
      window.clearInterval(this.intervalHome);
    }
  }
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    font-family: PingFangSC-Regular;
    &.hasTip{
      padding-top: 0.3rem;
    }

    > * {
      z-index: 1;
    }
  }

  .loan {
    position: relative;
    margin: 0.15rem 0.15rem 0;
    padding: 0.3rem 0.2rem 0.2rem;
    box-shadow: 0 7px 11px 0 rgba(253, 189, 0, 0.12);

    .title {
      line-height: 0.18rem;
    }

    .amount {
      padding: 0.05rem 0 0.15rem;
      font-weight: 400;
      line-height: 0.54rem;
      font-family: 'DIN';
    }

    .loan-btn {
      width: 1.5rem;
      height: 0.5rem;
      line-height: 0.5rem;
      background: linear-gradient(90deg, #F9C937 0%, #FFD34E 100%);
      box-shadow: 0 7px 5px 0 rgba(253, 189, 0, 0.12);
      border-radius: 0.25rem;
      text-align: center;
      font-family: PingFangSC-Medium;
      font-weight: 500;

      &.disabled {
        color: #fff;
        background: #c1c1c1;
        box-shadow: none;
      }
    }

    .repay-details {
      width: 0.7rem;
      height: 0.3rem;
      line-height: 0.3rem;
      position: absolute;
      top: 0.24rem;
      right: 0.22rem;
      font-size: 0.12rem;
      @include bg-image('~@/assets/h5processImages/home/icon-right', right/0.17rem 0.17rem no-repeat);
      z-index: 2;
      @media screen and (max-device-width: 320px) {
        width: 0.75rem;
      }
    }
  }

  .repayment {
    position: relative;
    margin: 0.15rem 0.15rem 0;
    height: 2.1rem;
    @include bg-image('~@/assets/h5processImages/home/wallet', center/100% 100% no-repeat);

    .repay-details {
      width: 1.13rem;
      height: 0.3rem;
      line-height: 0.3rem;
      position: absolute;
      top: 0.19rem;
      right: 0.28rem;
      text-align: center;
      font-size: 0.12rem;
      @include bg-image('~@/assets/h5processImages/home/icon-right', 0.88rem/0.17rem 0.17rem no-repeat);
      z-index: 2;
    }

    .repay-btn {
      position: absolute;
      right: 0.24rem;
      top: 0.98rem;
      width: 1.3rem;
      height: 0.4rem;
      display: flex;
      display: -webkit-flex;
      border-radius: 0.4rem;
      @include bg-image('~@/assets/h5processImages/home/icon-right', 0.95rem/0.17rem 0.17rem no-repeat #fff);
      z-index: 2;

      p {
        flex: 1;
        margin-left: 0.2rem;
        line-height: 0.4rem;
      }

      &.disabled {
        p {
          color: #fff;
        }

        @include bg-image('~@/assets/h5processImages/home/icon-right-disabled', 0.95rem/0.17rem 0.17rem no-repeat #c1c1c1);
      }
    }

    .repay-info {
      margin: 0.8rem 0 0 0.21rem;

      .info-title {
        line-height: 0.18rem;
      }

      .info-amount {
        margin-top: 0.03rem;
        font-family: DIN-Medium;
        font-weight: 500;
        line-height: 0.42rem;
        height: 0.42rem;
      }

      .info-no-amount {
        margin-top: 0.03rem;
        font-size: 0.3rem;
        font-weight: 600;
        font-family: PingFangSC-Medium;
      }

      .info-no-bill {
        margin-top: 0.03rem;
        font-size: 0.24rem;
        font-weight: 600;
        font-family: PingFangSC-Medium;
      }
    }

    .repay-bank {
      display: flex;
      display: -webkit-flex;
      margin: 0.16rem 0 0 0.22rem;
      line-height: 0.2rem;

      .bank-info, .date {
        font-size: 0.13rem;
      }

      .bank-info {
        margin-left: 0.08rem;
      }

      .date {
        margin-left: 0.08rem;
      }
    }
  }

  .available-limit {
    margin: 0.65rem 15px 0;
    text-align: center;

    .limit-title {
      position: relative;
      width: 1.6rem;
      margin: 0 auto;
      line-height: 0.24rem;
      height: 0.24rem;

      &:before, &:after {
        display: block;
        position: absolute;
        top: -0;
        content: "";
        width: 0.24rem;
        height: 0.24rem;
        @include bg-image('~@/assets/h5processImages/home/icon-star', center/40% 40% no-repeat);
      }

      &:after {
        right: 0 !important;
      }
    }

    .limit {
      padding: 0.04rem 0 0.2rem;
      font-weight: 400;
      line-height: 0.34rem;
      font-family: 'DIN';
    }

    .progress {
      width: 2.9rem;
      margin: 0 auto;
      height: 0.04rem;
      background-color: #E8E8E8;
      overflow: hidden;

      .progress-bar {
        height: 100%;
        background-color: #FFD526;
        transition: width 1s ease;
        -webkit-animation: animate-positive 2s;
        animation: animate-positive 2s;
      }
    }
  }

  .download-text {
    margin: 0 15px;
    padding: 0.1rem 0 0.25rem;
    line-height: 1;
    text-align: center;
    border-bottom: 1px solid #E7E7E7;
  }

  .bg-home {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2.47rem;
    @include bg-image('~@/assets/h5processImages/home/home-bg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    z-index: 0;
  }

  @-webkit-keyframes animate-positive {
    0% {
      width: 0;
    }
  }

  @keyframes animate-positive {
    0% {
      width: 0;
    }
  }
</style>
