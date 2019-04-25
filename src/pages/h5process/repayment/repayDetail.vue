<template>
  <div class="repay-detail-warpper">
    <BillDetailList :listState="listState" :isPrePayFee='isPrePayFee' :list-data='listData' cell-style='keepSpread' />
  </div>
</template>

<script>
import BillDetailList from '@/components/h5process/repayment/BillDetailList.vue';

import { mapGetters, mapActions } from 'vuex';

export default {
  name: "repayDetail",
  components: { BillDetailList },
  data() {
    return {
      // 提前结清，一键还款，按期还款
      type: null,
      selectedIndex: null,
    }
  },
  computed: {
    // 本模块
    ...mapGetters('repayment/billDetailSearch', [
      'payableBills',
      'needRepayBills',
      'shouldRepayBills',
      'isLoading',
      'isFail',
      'isLoaded',
      'isPrePayFee', // 是否为前置费
    ]),
    listState() {
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
    listData() {
      const type = this.type;
      const needRepayBills = this.needRepayBills;
      const payableBills = this.payableBills;
      const shouldRepayBills = this.shouldRepayBills;
      const selectedIndex = this.selectedIndex;
      if (type === 'early') {
        // 提前结清
        return needRepayBills;
      } else if (type === 'normal') {
        // 一键还款
        return payableBills;
      } else {
        // 按期还款(according)
        return selectedIndex.ruduce((total, item) => {
          const billInfo = shouldRepayBills[item];
          if (billInfo) total.push(billInfo);
        }, []);
      }
    }
  },
  methods: {
    ...mapActions(['showToast']),
    ...mapActions('repayment/billDetailSearch', [
      // 获取订单详情
      'getOrderList'
    ]),
  },
  created() {
    console.log(this.$store)
    const type = this.$route.params.type;
    if (type !== 'normal' && type !== 'early') {
      // 按期还款
      const indexsStr = decodeURIComponent(type);
      this.selectedIndex = indexsStr ? indexsStr.split(',') : '';
      this.type = 'according'; // 按期还款
    } else {
      this.type = type;
    }
  },
  async mounted() {
    try {
      if (!this.isLoading && !this.isLoaded) { // 需重新架加载数据
        const order = this.$route.query.order;
        await this.getOrderList({ order });
      }
      if (!this.listData) {
        this.showToast({ text: '未发现订单信息' });
        this.$occurError('/home');
      }
    } catch (err) {
      this.$occurError(err);
    }
  },
}
</script>

<style lang='scss' scoped>
.repay-detail-warpper {
  width: 100%;
  position: relative;
}
</style>