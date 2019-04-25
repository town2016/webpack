<template>
  <div class="container">
    <message-panel class="m-t-20" :message="'提现申请已提交'" tip="预计10分钟到帐，请以实际到账时间为准!">
    </message-panel>
    <div class="surplus" v-if="unSubmitMoney&&unSubmitMoney>0">
      剩余可提现金额{{unSubmitMoney}}元
    </div>
    <div class="btn-box">
      <mt-button v-if="!(unSubmitMoney&&unSubmitMoney>0)" @click.native="complete" type="primary" class="btn-next">完成</mt-button>
      <mt-button v-if="unSubmitMoney&&unSubmitMoney>0" @click.native="nextStep" type="primary" class="btn-next">继续提现</mt-button>
    </div>
  </div>
</template>
<script>
import { MessagePanel, HintPanel } from "@/components/iqiyi/withdraw";
import storage from '@/utils/storage';
// import Api from '@/api';
import { Indicator, Toast } from 'mint-ui';

export default {
  name: "SecurityResult", // 提风险保障金结果页面
  data() {
    return {
      submitMoney: this.$route.query.submitMoney.split(',')[0],
      unSubmitMoney: this.$route.query.submitMoney.split(',')[1],
      huaRunLoanObjInfo: {}, // 借款相关信息
    }
  },
  components: {
    MessagePanel,
    HintPanel
  },
  created() {
    // if (!this.$route.query.submitMoney) {
    //   Toast("获取提现金额、未提现金额失败！");
    //   window.setTimeout(() => {
    //     window.history.go(-1);
    //   }, 3000);
    //   return;
    // }
    this.huaRunLoanObjInfo = JSON.parse(storage.read('huaRunLoanObjInfo'));
  },
  methods: {
    nextStep() {
      this.$router.replace({ path: '/withdraw' });
    },
    complete() {
      if (this.huaRunLoanObjInfo && this.huaRunLoanObjInfo.returnUrl) {
        window.location.href = this.huaRunLoanObjInfo.returnUrl
        // if(this.huaRunLoanObjInfo.returnUrl.indexOf("?")>=0){
        //   window.location.href = this.huaRunLoanObjInfo.returnUrl + "&status=2";
        // }else{
        //   window.location.href = this.huaRunLoanObjInfo.returnUrl + "?status=2";
        // }
        storage.delete("huaRunLoanObjInfo");
      } else {
        window.history.go(-2);
        // Toast('获取跳转页面失败');
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  display: block;
}
.surplus {
  background-color: #ffffff;
  margin: 0.1rem 0.2rem;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  color: #999999;
  font-size: 0.16rem;
}
.btn-box {
  padding: pxToRem(15);
  position: relative;
}

.btn-next {
  // margin: pxToRem(15);
  height: 0.45rem;
  border-radius: pxToRem(44);
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
</style>
