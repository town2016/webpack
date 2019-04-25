<template>
  <div class="wy-repay">
    <!-- <div class="wy-repay__part">部分还款</div> -->
    <div class="wy-repay__frame">
      <ShouldRepayBills v-if='shouldRepayArrState==="valuable"' :type='2' :list='shouldRepayArr' @pay='pay'></ShouldRepayBills>
      <ListState v-else :type='shouldRepayArrState'>
        <div class="error-btn" @click='reload'>重新加载</div>
      </ListState>
    </div>
  </div>
</template>
<script>
// #@todo
import { ShouldRepayBills, ListState, } from '@/components/h5process/repayment';

import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'EarlyBillsRepay',
  components: { ShouldRepayBills, ListState },
  computed: {
    ...mapGetters('repayment/EarlyBillsRepay', [
      'shouldRepayArrState',
    ]),
    ...mapState('repayment/EarlyBillsRepay', [
      'shouldRepayArr',
    ]),
  },
  destroyed() {
    //清除模块数据
    this.CLEAR_WHOLE_DATA();
  },
  methods: {
    ...mapActions('repayment/EarlyBillsRepay', ['getCreditBillDetail']),
    ...mapMutations('repayment/EarlyBillsRepay', ['CLEAR_WHOLE_DATA']),
    reload() {
      this.initData();
    },
    pay({ phases, money }) {
      console.log(repayJson);
      const repayJson = [{
        contractNo: this.shouldRepayArr[0].contractNo, //合同号
        applyid: this.oId, // 订单编号
        money,
        payType: 'creditLoan', //
        phases, // '5,6,7'
        repayType: '3', // 提前结清
      }];
      const jsonStr = JSON.stringify(repayJson);
      sessionStorage.setItem('repayJsonStr', JSON.stringify({
        repaymentListJson: jsonStr,
        bankInfo: this.bankInfo,
        money,
      }));

      this.$router.push('/OrderPay');
    },
    initData() {
      //获取订单详情（初始化数据）
      this.getCreditBillDetail({ order: this.oId }).catch((err) => {
        // const { desc, errStatus } = err;
        // if (errStatus === 2) { // 未实名
        //   console.dir(err);
        //   this.$router.go(-1);
        // }
        if (process.env.NODE_ENV === "development")
          throw err;
      });
    },
  },
  created() {
    this.oId = this.$route.params.order;
    this.initData();
    // this.$store.dispatch('setCommonConfig', { showTabbar: false, }); // 不需要显示底部tabs
  },
};
</script>
<style lang="scss" scoped>
.wy-repay {
  width: 100%;
  position: relative;
}

.wy-repay__frame {
  position: absolute;
  top: 0.15rem; // 0.3rem;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%; // height: 100%;
}

.error-btn {
  width: 1rem;
  height: 0.28rem;
  line-height: 0.28rem;
  text-align: center;
  margin: 0.2rem auto 0;
  color: #e84438;
  border: 1px solid #e84438;
  border-radius: 0.14rem;
  font-size: 0.15rem;
}

.wy-repay__part {
  position: absolute;
  right: 0.08rem;
  padding: 0 0.04rem;
  top: 0;
  font-size: 0.14rem;
  color: #368eff;
  line-height: 0.3rem;
}
</style>
