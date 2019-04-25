<template>
  <div class="wy-repay">
    <!-- banner -->
    <RepayDetailBanner :unpaidMoney='unpaidTotal' :phase='phasesTotal' :isExistDoing='isExistDoing' :isExistUndo='isExistUndo'
                       :isExistPayable='isExistPayable' />
    <!-- tabs -->
    <SwitchTabs v-if='tabsConf && !isWholeSettle' :itemsConf='tabsConf' @tabsSwitch="tabsSwitch" />
    <!-- <TipNavigation v-if='NotWholeSettle' v-show='selTab===1' text='提前还清所有账单' @click.native='earlyRepay'></TipNavigation> -->
    <!-- 应还账单列表 -->
    <div class="wy-repay__frame" v-if='!isWholeSettle' v-show='selTab===0'>
      <BillDetailList :list-state='dataState' :isPrePayFee='isPrePayFee' :list-data='shouldRepayBills' @reload='reload'
                      @tickSwitch='tickSwitch' />
    </div>
    <!-- 已还账单列表 -->
    <div class="wy-repay__frame" :class='{"frame--top":isWholeSettle}' v-show='selTab===1 || isWholeSettle'>
      <BillDetailList :list-state='dataState' :list-data='paidBills' empty-desc='空空如也~~' @reload='reload' />
    </div>
    <!-- <ListState type='fail' v-if='selTab===null'></ListState> -->
  </div>
</template>
<script>
import BillDetailList from '@/components/h5process/repayment/BillDetailList.vue';
// import TipNavigation from '@/components/h5process/repayment/TipNavigation';
import SwitchTabs from '@/components/h5process/repayment/SwitchTabs';
import RepayDetailBanner from '@/components/h5process/repayment/RepayDetailBanner.vue';
import ListState from '@/components/h5process/repayment/ListState.vue';

import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'billDetailOperate',
  components: { SwitchTabs, ListState, RepayDetailBanner, BillDetailList },
  data() {
    return {
      tabsConf: null,
      selTab: 0,
      unpaidMoney: 1,
    };
  },
  computed: {
    // 本模块
    ...mapGetters('repayment/billDetailSearch', [
      'shouldRepayBills',
      'paidBills',
      'isExistPayable', // 存在能够支付的单
      'isExistDoing', // 存在正在划扣中的单
      'isExistUndo', // 是否存在未出账单
      'unpaidTotal', // 未还总金额
      'isLoaded',
      'isFail',
      'isPrePayFee', // 是否为前置费
      'phasesTotal' // 总期数
    ]),
    dataState() {
      const isFail = this.isFail;
      const isLoaded = this.isLoaded;
      if (!isLoaded) {
        return 'loading';
      }
      if (isFail) {
        return 'fail';
      }
      return 'valuable'
    },
    unpaidPhaseTotal() {
      return this.shouldRepayBills.length;
    }, // 结清状态
    isWholeSettle() {
      const isLoaded = this.isLoaded; // 加载完成，数据才能参考
      const isExistDoing = this.isExistDoing; // 存在正在划扣的订单
      const unpaidPhaseTotal = this.unpaidPhaseTotal;
      return isLoaded && unpaidPhaseTotal === 0 && !isExistDoing;
    },
  },
  methods: {
    ...mapActions(['showToast']),
    ...mapActions('repayment/billDetailSearch', [
      // 获取订单详情
      'getOrderList'
    ]),
    tabsSwitch(index) {
      this.selTab = index;
    },
    tickSwitch({ index, options: { selected } }) {
      // 这里会获取到初始化选中状态，和同步改变的状态
      if (selected) {
        this.selectedIndexSet.add(index);
      } else {
        this.selectedIndexSet.delete(index);
      }
      console.log(this.selectedIndexSet);
    },
    goToPay() {
      // 储存选中的订单索引
      // sessionStorage.setItem('selectedBillsIndex', [...this.selectedIndexSet].join(','));
      const selectedBillsIndex = [...this.selectedIndexSet].join(',');
      this.$router.push(`/orederPay/${encodeURIComponent(selectedBillsIndex)}`);
    },
    // earlyRepay() { // 提前结清
    //   this.$router.push({ path: `/EarlyBillsRepay/${this.oId}` });
    //   console.log('earlyRepay');
    // },
    reload() {
      const order = this.$route.query.order;
      this.getOrderList({ order });
    },
  },
  created() {
    this.reload();
    this.tabsConf = [{ text: '应还账单' }, { text: '已还账单' }];
    // 用于储存所有选中的订单
    this.selectedIndexSet = new Set();
  },
};
</script>
<style lang="scss" scoped>
.wy-repay {
  width: 100%;
}

.wy-repay__frame {
  position: absolute;
  top: 1.82rem;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;

  &.frame--top {
    top: 1.35rem;
  }
}
</style>