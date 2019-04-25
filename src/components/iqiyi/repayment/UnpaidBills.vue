<template>
  <div class="unpaid-bills" ref='scroller'>
    <div class="unpaid-banner">
      <p class="value">{{total}}</p>
      <p class="des">当前应还金额（元）</p>
      <p class="value">{{restPhase}}</p>
      <p class="des">剩余期数（月）</p>
    </div>
    <div class="bill" v-for='(item,index) in list' :key='index'>
      <div class="bill-header"><span>{{getMonth(item.shouldRepayDate)}}月账单</span><span class="specific">{{(item.shouldTotal*1).toFixed(2)}}元</span></div>
      <div class="bill-body">
        <p>最后还款日：{{item.shouldRepayDate}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UnpaidBills',
  props: ['list'],
  data() {
    return {};
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
  computed: {
    restPhase() {
      const list = this.list;
      return Array.isArray(list) ? list.length : 0;
    },
    total() {
      const list = this.list;
      if (!Array.isArray(list)) {
        return '0.00';
      }
      let count = 0;
      list.forEach((x) => {
        count += x.shouldTotal * 1;
      });
      return count.toFixed(2);
    }
  },
  beforeDestroy() {
    this.$parent.$off('stateSync');
  },
  created() {
    this.$parent.$on('stateSync', (v) => {
      this.state = v;
    });
  },
  mounted() {
    this.$refs.scroller.addEventListener('scroll', function (e) {
      e.stopPropagation();
    });
    this.$refs.scroller.addEventListener('touchmove', function(e) {
      e.stopPropagation();
    });
  },
};
</script>
<style lang="scss" scoped>
.unpaid-bills {
  // padding-top: 0.15rem;
  position: absolute;
  top: 0rem;
  bottom: 0;
  left: 0;
  right: 0;
  @include hide-y-scrolbar();
}

.unpaid-banner {
  height: 1.6rem;
  width: 3.45rem;
  margin-left: 0.15rem;
  border-radius: 5px;
  @include bg-image('~@/assets/images/repay/unpaid_bg');
  background-size: 100% 100%;
  margin-bottom: 0.15rem;
  padding: 0 20px;
  overflow: hidden;
  color: #fff;
  line-height: 1;

  .value {
    padding-top: 0.2rem;
    font-family: 'DIN';
    font-size: .31rem;
  }

  .des {
    margin-top: 0.05rem;
    font-size: .13rem;
  }
}

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