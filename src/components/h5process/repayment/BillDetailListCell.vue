<template>
  <div class="bill-warpper">
    <!-- 前置费用的情况 -->
    <div class="bill-header none" v-if='isPrepay'>
      <div class="view">咨询服务费<span class="specific">{{cellInfo.totalAmt}}元</span></div>
    </div>
    <!-- 提前结清的情况 -->
    <!-- <div class="bill-header" v-else-if='cellInfo.isEarlyPay'>
      <div class="view">提前结清<span class="specific">{{cellInfo.earlyPayFee}}元</span></div>
    </div> -->
    <div class="bill-header" :class="seletedStyle" v-else @click="spreadOrShrinkBody">
      <div class="header-tick" v-if='selectabled' :class="[tickClass]" @click='tickSwitch'></div>
      <div class="view">
        <span>{{cellInfo._date}}</span>
        <span :class="getStatusClassName()">({{cellInfo._desc}})</span>
        <span class="specific" :class="[className]">{{cellInfo._shouldTotal}}元</span>
      </div>
      <div class="phase-view">期数：{{cellInfo.phase}}/{{cellInfo.phases}}期</div>
    </div>
    <!-- 前置费用的情况 -->
    <div class="bill-body" :class="{spread:isSpread}" v-if='isPrepay'>
      <div class="bill-sub-wrapper">
        <p>咨询服务费：{{cellInfo.frontFee}}元</p>
      </div>
    </div>
    <!-- 提前结清的情况 -->
    <!-- <div class="bill-body" :class="{spread:isSpread}" v-else-if='cellInfo.isEarlyPay'>
      <div class="bill-sub-wrapper">
        <p>提前结清费用：{{cellInfo.earlyPayFee}}元</p>
      </div>
    </div> -->
    <div class="bill-body" :class="{spread:isSpread}">
      <div class="bill-sub-wrapper" :class='{selectabled}'>
        <p v-if='cellInfo._capital>0'>应还本金：{{cellInfo._capital}}元</p>
        <p v-if='cellInfo._shouldInterest>0'>应还利息：{{cellInfo._shouldInterest}}元</p>
        <p v-if='cellInfo._overdueInterest>0'>逾期利息：{{cellInfo._overdueInterest}}元</p>
        <p v-if='cellInfo._manageFee>0'>管理费用：{{cellInfo._manageFee}}元</p>
        <p v-if='cellInfo._earlyRepayFee>0'>提前结清手续费：{{cellInfo._earlyRepayFee}}元</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BillDetailListCell',
  props: {
    isPrepay: {
      type: Boolean,
      default: false,
    },
    cellInfo: {
      type: Object,
      required: true,
    },
    cellStyle: {
      type: String,
      default: 'shrink',
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['keepSpread', 'spread', 'shrink'].indexOf(value) !== -1
      }
    },
    // 是否能够选中
    seletedStyle: {
      type: String,
      default: 'none',
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['none', 'selected', 'unselected', 'selected-disabled', 'unselected-disabled'].indexOf(
          value) !== -1
      }
    },
  },
  data() {
    return {
      isSpread: false,
      keepSpread: false,
      selectabled: false, // 是否能够勾选
      selected: null, // 是否选中
      isDisabled: false, // 是否禁止操作
    };
  },
  computed: {
    className() {
      const keepSpread = this.keepSpread;
      const isSpread = this.isSpread;
      return keepSpread ? 'none' : (isSpread ? 'spread' : 'shrink');
      // const isPaid = this.cellInfo._isPaid; // 已经支付的订单
      // return isPaid ? "none" : (isSpread ? keepSpread ? 'none' : 'spread' : 'shrink');
    },
    tickClass() {
      const selected = this.selected;
      const isDisabled = this.isDisabled;
      if (selected) { // 选中
        if (isDisabled) {
          return 'selected-disabled';
        } else {
          return 'selected';
        }
      } else { // 非选中
        if (isDisabled) {
          return 'unselected-disabled';
        } else {
          return 'unselected'
        }
      }
    }
  },
  methods: {
    tickSwitch() {
      if (this.isDisabled) {
        return;
      }
      this.selected = !this.selected;
    },
    spreadOrShrinkBody() {
      if (this.keepSpread) {
        return;
      }
      this.isSpread = !this.isSpread;
    },
    statusIsShow() {
      const item = this.cellInfo;
      if (item.isOverdueBill || item.customStatus === 0 || item.customStatus ===
        1) {
        return true;
      }
      return false;
    },
    getStatusClassName() {
      const item = this.cellInfo;
      if (item.status === 5) { // 优先级最高,正在划扣中
        return 'default';
      } else if (item.status === 3) { // 逾期
        return 'overdue';
      } else { // 其他
        return 'default';
      }
    },
    // @#todo 逾期 → 待还 → 未出
    getStatusText() {
      const item = this.cellInfo;
      if (item.customStatus === 0) { // 优先级最高
        return '正在划扣中';
      } else if (item.customStatus === 1) {
        return '划扣失败';
      } else if (item.customStatus === 2) { // @#todo 待
        return '待还款';
      } else if (item.customStatus === 3) { // @#todo 未出
        return '未出';
      } else if (item.isOverdueBill) { // 优先级最低
        return '逾期';
      };
      return '';
    },
    seletedStyleChange() {
      const seletedStyle = this.seletedStyle;
      switch (seletedStyle) {
        case 'none': // 无勾选操作
          this.selectabled = false;
          break;
        case 'selected': // 默认勾选状态
          this.selectabled = true;
          this.selected = true;
          break;
        case 'unselected': // 默认非勾选状态
          this.selectabled = true;
          this.selected = false;
          break;
        case 'selected-disabled': // 禁止操作，勾选状态
          this.selectabled = true;
          this.selected = true;
          this.isDisabled = true;
          break;
        case 'unselected-disabled': // 禁止操作，非勾选状态
          this.isSpread = false;
          this.selected = false;
          this.isDisabled = true;
          break;
      }
    }
  },
  created() {
    if (this.isPrepay) { // 前置费用
      this.isSpread = true; // 强制展开
    } else {
      const cellStyle = this.cellStyle;
      switch (cellStyle) {
        case 'keepSpread':
          this.isSpread = true;
          this.keepSpread = true;
          break;
        case 'spread':
          this.isSpread = true;
          this.keepSpread = false;
          break;
        case 'shrink':
          this.isSpread = false;
          this.keepSpread = false;
          break;
      }
    }
    // 初始化数据
    this.seletedStyleChange();
    // this.$watch('seletedStyle',()=>{})
  },
  watch: {
    seletedStyle() {
      this.seletedStyleChange();
    },
    // 选中状态发生改变，则向上通知父级
    selected(newVal) {
      this.$emit('tickSwitch', { selected: newVal });
    }
  }
}
</script>

<style lang='scss' scoped>
.bill-warpper {
  // margin-bottom: 1px;
  background-color: #fff;
  border-bottom: 1px solid #f3f3f3;
}

.overdue {
  color: #F33F3D;
  margin-left: 0.1rem;
}

.default {
  color: #757575;
  margin-left: 0.1rem;
}

.bill-header {
  font-size: .15rem;
  padding-left: 0.5rem;
  height: .6rem;
  padding-top: 0.05rem;
  position: relative;
  color: #212121;

  &.none {
    padding-left: 0.15rem;
  }

}

.header-tick {
  position: absolute;
  left: .14rem;
  top: 0.1rem;
  width: 0.25rem;
  height: 0.25rem;
  background-color: wheat;
  // &.selected {}

  // &.unselected {}

  // &.selected-disabled {}

  // &.unselected-disabled {}
}

.view {
  overflow: hidden;
  font-size: 0;
  height: .3rem;
  line-height: .3rem;

  &>* {
    font-size: .15rem;
  }
}

.phase-view {
  color: #757575;
  font-size: .13rem;
  height: .18rem;
  line-height: .18rem;
}

.specific {
  float: right;
  margin-right: .12rem;
  font-size: .16rem;
  padding-right: .26rem;
  background-position: right center;
  background-size: .20rem auto;
  background-repeat: no-repeat;

  &.shrink {
    @include bg-image('~@/assets/h5processImages/Repayment/spread-icon', auto);
  }

  &.spread {
    @include bg-image('~@/assets/h5processImages/Repayment/shrink-icon', auto);
  }

  &.none {
    padding-right: 0rem;
  }
}

.bill-body {
  border-top: none;
  height: 0;
  font-size: .14rem;
  //transition: height 5s ease-in-out;
  overflow: hidden;

  &.spread {
    height: auto;
    border-top: 1px solid #f3f3f3;
  }

  p {
    margin-bottom: .12rem;
    color: #757575;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}

.bill-sub-wrapper {
  padding: .15rem 0 .15rem .15rem;
  background-color: #fffdf0;

  &.selectabled {
    padding-left: 0.5rem;
  }
}
</style>