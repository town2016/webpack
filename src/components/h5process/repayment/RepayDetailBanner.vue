<template>
  <div class="banner-warpper">
    <div class="sub-container" v-if='isInited'>
      <div class="top-area" v-if='isSettled'>
        <div class="full-repay">全部还清</div>
      </div>
      <div class="top-area" v-else>
        <div class="line-container">
          <div class="unpaid-total__desc">未还总金额(元)</div>
          <div v-if='isExistUndo' class="early-repay" @click="earlyRepay">提前结清</div>
        </div>
        <div class="unpaid-money">{{unpaidMoney}}</div>
        <div class="one-key-repay" @click="oneKeyRepay">一键还款</div>
      </div>
      <p class="note-desc">共{{phase}}期（最后还款日每月1号）</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RepayDetailBanner',
  props: {
    unpaidMoney: {
      require: true
    },
    phase: {
      require: true
    },
    // 存在划扣中的账单
    isExistDoing: {
      type: Boolean,
      require: true
    },
    isExistPayable: { // 是否能够去还款
      type: Boolean,
      require: true
    },
    // 存在未出账单
    isExistUndo: {
      type: Boolean,
      require: true
    }
  },
  computed: {
    // 已经初始化完成
    isInited() {
      return this.unpaidMoney === null ? false : !isNaN(this.unpaidMoney * 1);
    },
    // 能够支付的金额为0
    unPaidMoneyIsZero() {
      const unpaidMoney = this.unpaidMoney; // number string
      return Number(unpaidMoney) === 0;
    },
    // 是否能够去还款
    // repayabled() {
    //   return !this.unPaidMoneyIsZero;
    // },
    // 全部结清
    isSettled() {
      const unPaidMoneyIsZero = this.unPaidMoneyIsZero;
      const isExistDoing = this.isExistDoing;
      return unPaidMoneyIsZero && !isExistDoing;
    },
  },
  methods: {
    earlyRepay() {
      if (this.isExistDoing) {
        this.$store.dispatch('showToast', { text: '存在正在划扣中的订单,请完成划扣后刷新重试' });
        return;
      }
      const order = this.$route.query.order;
      const query = order ? { order } : {};
      this.$router.push({ path: '/orderPay/early', query });
      // this.$router.push('/orderPay/early');
      console.log('提前结清');
    },
    oneKeyRepay() {
      if (!this.isExistPayable) {
        this.$store.dispatch('showToast', { text: '未发现可支付订单' });
        return;
      }
      const order = this.$route.query.order;
      const query = order ? { order } : {};
      this.$router.push({ path: '/orderPay/normal', query });
      // this.$router.push('orderPay/normal')
    }
  }
}
</script>

<style lang='scss' scoped>
.banner-warpper {
  height: 1.35rem;
  padding: 0.04rem .15rem 0;
  width: 100%;
  @include bg-image('~@/assets/h5processImages/Repayment/banner-bg', (center top/100% auto no-repeat, #ffdf58));
}

.sub-container {
  width: 100%;
}

.top-area {
  height: .9rem;
}

.full-repay {
  font-family: 'PingFangSC';
  font-size: .36rem;
  line-height: 1;
  padding-top: .34rem;
}

.unpaid-money {
  font-family: DIN;
  font-size: .44rem;
  color: #212121;
  line-height: 1;
}

.line-container {
  overflow: hidden;
  line-height: .43rem;
  font-size: .14rem;
}

.unpaid-total__desc {
  float: left;
}

.early-repay {
  padding: 0 .23rem 0 .1rem;
  line-height: .31rem;
  margin-top: .05rem;
  float: right;
  background: url(~@/assets/images/common/rightarrow@3x.png)right center/ 0.07rem auto no-repeat;
}

.note-desc {
  font-size: .14rem;
}

.one-key-repay {
  position: absolute;
  top: .5rem;
  right: .15rem;
  height: .36rem;
  width: 1.2rem;
  border-radius: .2rem;
  background-color: #fff;
  text-align: center;
  line-height: .38rem;
  color: #212121;
  font-size: .16rem;
  font-weight: bold;
}
</style>