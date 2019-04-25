<template>
  <div class="bill">
    <div class="bill-header">
      <div class="handler" :class='handlerClassName()' @click='tickSwitch()'></div>
      <div class="view" v-if='!isPrePay'>
        <span>{{getTitle()}}</span>
        <span v-if='statusIsShow()' :class="getStatusClassName()">({{getStatusText()}})</span>
        <span class="specific">{{cellInfo.coustomTotal}}元</span>
      </div>
      <div class="view" v-else>咨询服务费<span class="specific">{{cellInfo.frontFee}}元</span></div>
    </div>
    <div class="bill-body" v-if='isPrePay'>
      <p>咨询服务费：{{cellInfo.frontFee}}元</p>
    </div>
    <div class="bill-body" v-else>
      <p v-if='cellInfo.coustomCapital>0'>应还本金：{{cellInfo.coustomCapital}}元</p>
      <p v-if='cellInfo.shouldInterest>0'>应还利息：{{cellInfo.shouldInterest}}元</p>
      <p v-if='cellInfo.overdueInterest>0'>逾期利息：{{cellInfo.overdueInterest}}元</p>
      <p v-if='cellInfo.coustomManagerFee>0'>管理费用：{{cellInfo.coustomManagerFee}}元</p>
      <p v-if='cellInfo.earlyRepayFee>0'>提前结清手续费：{{cellInfo.earlyRepayFee}}元</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BillCell',
  props: {
    isPrePay: {
      type: Boolean,
      default: false,
    },
    cellInfo: {
      type: Object,
      required: true,
    },
    cellKey: {
      type: [String, Number],
      required: true,
    },
    // @desc 1->正常还款,2->提前结清
    type: {
      type: Number,
      default: 1, // 正常还款
    },
    selectedPhase: {
      type: Number,
      default: 0, // 正常还款
    }
  },
  methods: {
    statusIsShow() {
      const item = this.cellInfo;
      if (item.isOverdueBill || item.customStatus === 0 || item.customStatus === 1) {
        return true;
      }
      return false;
    },
    getStatusClassName() {
      const item = this.cellInfo;
      if (item.customStatus === 0) { // 优先级最高
        return 'default';
      } else if (item.isOverdueBill) {
        return 'overdue';
      } else {
        return 'default';
      }
    },
    handlerClassName() {
      const item = this.cellInfo;
      const customStatus = item.customStatus;
      if (item.isDoing) { // 正在划扣中
        return 'disabled';
      } else if (item.phase > this.selectedPhase * 1) {
        return 'cancel';
      }
      return '';
    },
    getStatusText() {
      const item = this.cellInfo;
      if (item.customStatus === 0) { // 优先级最高
        return '正在划扣中';
      } else if (item.customStatus === 1) {
        return '划扣失败';
      } else if (item.isOverdueBill) { // 优先级最低
        return '逾期';
      };
      return '';
    },
    getTitle() {
      const item = this.cellInfo;
      if (this.type === 2) { // 提前结清
        return '提前结清';
      } else if (item.title) { // 自定义
        return item.title;
      } else { // 正常还款
        try {
          const date = item.shouldRepayDate;
          const month = date.match(/\d{1,4}/g)[1];
          return (month.length === 2 ? month : 0 + month) + '月账单';
        } catch (err) {
          return '00' + '月账单';
        }
      }
    },
    tickSwitch() {
      const item = this.cellInfo;
      if (item.isDoing) { //正在划扣中
        this.$store.dispatch('showToast', { text: '正在尝试划扣中,不可勾选' });
        return;
      }
      if (this.isPrePay) {
        this.$store.dispatch('showToast', { text: '前置费用不可取消勾选' });
        return;
      }
      if (item.isOverdueBill) { // 逾期
        this.$store.dispatch('showToast', { text: '逾期账单不可取消勾选' });
        // this.$root.$emit('showModal', { type: 'toast', conf: { text: '逾期账单不可取消勾选', } });
        return;
      }
      if (this.type === 2) { // 提前结清
        this.$store.dispatch('showToast', { text: '提前结清不可取消勾选' });
        // this.$root.$emit('showModal', { type: 'toast', conf: { text: '提前结清不可取消勾选', } });
        return;
      }
      this.$emit('cellInfoTickSwitch', { cellKey: this.cellKey })
    },
  }
}
</script>

<style lang='scss' scoped>
.bill {
  min-height: 0.9rem;
  margin-bottom: 0.2rem;
  background-color: #fff;
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
  padding-left: 0.47rem;
  height: .45rem;
  line-height: .45rem;
  position: relative;
  color: #212121;
}

.handler {
  position: absolute;
  left: .14rem;
  top: 0.1rem;
  width: 0.25rem;
  height: 0.25rem;
  background: url(~@/assets/images/repay/tick.svg) center/0.22rem auto no-repeat;

  &.cancel {
    // background-image: url(~@/assets/images/repay/cancel_tick.svg);
    background: url(~@/assets/images/repay/tick_gray.png) center/0.2rem auto no-repeat;
  }

  &.disabled {
    background: url(~@/assets/images/repay/cancel_tick.svg) center/0.22rem auto no-repeat;
  }
}

.view {
  overflow: hidden;
  font-size: 0;

  &>* {
    font-size: .15rem;
  }
}

.specific {
  float: right;
  margin-right: .15rem;
  font-size: .16rem;
}

.bill-body {
  border-top: 1px solid #ededed;
  padding: .15rem 0 .15rem .47rem;
  font-size: .14rem;

  p {
    margin-bottom: .12rem;
    color: #757575;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>