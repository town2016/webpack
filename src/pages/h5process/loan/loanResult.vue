<!-- 申请车贷页 -->
<template>
  <div class="container">
    <div class="mt-30" v-if="orderStatus.code == 1 || orderStatus.code == 3 || orderStatus.code == 5 || orderStatus.code == 6 || orderStatus.code == 8">
      <SuccessPageIntro :text='{firstStep:"请等待到账短信通知（最快当天到账）",secondStep:"回到本页面提现到银行卡"}'></SuccessPageIntro>
      <base-button
        text='刷新'
        type='yellow'
        mt='.375rem'
        @click.native="doGetProcessInfo"
      ></base-button>
      <app-down-load class="app-download" v-if="baseConfig.isAdvertEnabled" :downloadUrl="baseConfig.downloadUrl" />
    </div>
    <div class="mt-30" v-else>

      <StatusTips
        v-if="orderStatus.code == 4"
        :showImg="require('@/assets/h5processImages/evaluateLimit/eval-reject@2x.png')"
        tips="抱歉，您暂时不符合借款条件"
        :info="orderStatus.rejectTimeLimitDate?orderStatus.rejectTimeLimitDate + '后可再次申请':''"
      ></StatusTips>

      <StatusTips
        v-if="orderStatus.code == 7 || orderStatus.code == 9 || orderStatus.code == 10"
        :showImg="require('@/assets/h5processImages/evaluateLimit/eval-info@2x.png')"
        tips="放款失败，请重新发起借款"
        button="重新借款"
        @statusClick="goLoanInfo"
      ></StatusTips>

      <StatusTips
        v-if="orderStatus.code == 11"
        :showImg="require('@/assets/h5processImages/evaluateLimit/eval-info@2x.png')"
        tips="该订单已放款"
        button="返回首页"
        @statusClick="toHome"
      ></StatusTips>

      <StatusTips
        v-if="orderStatus.code == 12"
        :showImg="require('@/assets/h5processImages/evaluateLimit/eval-reject@2x.png')"
        tips="账户异常，请结清后再借"
      ></StatusTips>
    </div>

  </div>
</template>

<script>
  import { Indicator } from "mint-ui";
  import NavigationBar from '@/components/h5process/givingCredit/NavigationBar';
  import StatusTips from '@/components/h5process/loan/StatusTips';
  import BaseButton from '@/components/h5process/base/BaseButton';
  import SuccessPageIntro from '@/components/h5process/repayment/SuccessPageIntro';
  import AppDownLoad from '@/components/h5process/common/AppDownload';

  import { mapActions, mapGetters } from 'vuex';

  import { GET_ORDER_STATUS } from "@/store/h5processModules/loan/enum/actionsEnum";
  import { ORDER_STATUS } from "@/store/h5processModules/loan/enum/gettersEnum";
  import { GET_CONFIG } from "@/store/h5processModules/config/enum/action-types";
  import { GET_PROCESS_INFO } from "@/store/h5processModules/redirect/enum/action-types";

  export default {
    name: "loanResult",
    components: {
      NavigationBar,
      StatusTips,
      BaseButton,
      SuccessPageIntro,
      AppDownLoad
    },
    data() {
      return {
        baseConfig: {}
      };
    },
    computed: {
      ...mapGetters({
        orderStatus: ORDER_STATUS
      }),
    },
    watch: {
      async orderStatus(newVal, oldVal) {
        if (newVal.code == 1 || newVal.code == 3 || newVal.code == 5 || newVal.code == 6 || newVal.code == 8) {
          this.baseConfig = await this.getConfig();
        }else if(newVal.code == 0 || newVal.code == 13){
          this.goLoanInfo();
        }
      }
    },
    methods: {
      ...mapActions({
        getOrderStatus: GET_ORDER_STATUS,
        getConfig: GET_CONFIG,
        getProcessInfo: GET_PROCESS_INFO,
      }),
      goLoanInfo() {
        this.$router.replace("/loanInfo");
      },
      doGetProcessInfo() {
        Indicator.open();
        this.getProcessInfo();
        setTimeout(()=>{
          Indicator.close();
        },1000)
      },
      toHome() {
        this.$router.replace("/home");
      },
      async downApp() {
        window.location.href = this.baseConfig.downloadUrl;
      }
    },
    created() {
      // 获取订单状态
      this.getOrderStatus();
    }
  };
</script>

<style scoped>
  .container {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    padding-bottom: 1rem;
  }
  .mt-30{
    margin-top: 0.3rem;
  }
  .app-download {
    position: fixed;
    bottom: 0.2rem;
    left: 0;
    background-color: #fff;
  }
</style>

