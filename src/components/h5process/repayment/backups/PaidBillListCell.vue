<template>
  <div class="bill">
    <div class="bill-header"><span>{{getMonth(cellInfo.shouldRepayDate)}}月账单</span><span class="specific">{{(cellInfo.shouldTotal*1).toFixed(2)}}元</span></div>
    <div class="bill-body">
      <p>最后还款日：{{cellInfo.shouldRepayDate}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PaidBillListCell',
  props: {
    cellInfo: {
      type: Object,
      required: true,
    }
  },
  methods: {
    getMonth(date) {
      try {
        const month = date.match(/\d{1,4}/g)[1];
        return month.length === 2 ? month : 0 + month;
      } catch (err) {
        return '00';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bill {
  background-color: #fff;
}

.bill-header {
  font-size: .16rem;
  padding-left: 0.15rem;
  height: .4rem;
  line-height: .4rem;
  overflow: hidden;
  color: #212121;
}

.specific {
  float: right;
  margin-right: .15rem;
}

.bill-body {
  padding: 0 0 .15rem .15rem;
  font-size: .14rem;
  border-bottom: 1px solid #ededed;

  p {
    margin-bottom: .12rem;
    color: #757575;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>