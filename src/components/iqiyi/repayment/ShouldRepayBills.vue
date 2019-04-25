<template>
  <div class="should-repay-bills">
    <div class="bill" v-for='(item,index) in list' v-initItem='{item,_self}' :key='index'>
      <div class="bill-header">
        <div class="handler" :class='handlerClassName(item)' @click='tickSwitch(item)'></div>
        <div class="view" v-if='isNotPrePay'>
          <span>{{getTitle(item)}}</span>
          <span v-if='statusIsShow(item)' :class="getStatusClassName(item)">({{getStatusText(item)}})</span>
          <span class="specific">{{item.coustomTotal}}元</span>
        </div>
        <div class="view" v-else>咨询服务费<span class="specific">{{item.frontFee}}元</span></div>
      </div>
      <div class="bill-body" v-if='isNotPrePay'>
        <p v-if='item.coustomCapital>0'>应还本金：{{item.coustomCapital}}元</p>
        <p v-if='item.shouldInterest>0'>应还利息：{{item.shouldInterest}}元</p>
        <p v-if='item.overdueInterest>0'>逾期利息：{{item.overdueInterest}}元</p>
        <p v-if='item.coustomManagerFee>0'>管理费用：{{item.coustomManagerFee}}元</p>
        <p v-if='item.earlyRepayFee>0'>提前结清手续费：{{item.earlyRepayFee}}元</p>
      </div>
      <div class="bill-body" v-else>
        <p>咨询服务费：{{item.frontFee}}元</p>
      </div>
    </div>
    <div class="bill_pay" v-if='list&&list!==true&&list.length!==0'>
      <span class="key">合计还款：</span>
      <span class="value">¥{{total}}</span>
      <div class="immediate-pay" @click='pay'>立即支付</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ShouldRepayBills',
  props: {
    list: {
      required: true,
    },
    /**
     * @desc 1->正常还款,2->提前结清
     */
    type: {
      default: 1, // 正常还款
      type: Number,
    }
  },
  data() {
    return {
      selectPhase: Infinity, // 选中的期数，默认全选中
      state: 'loading', // suc->加载完成,loading->加载中,empty->数据为空,fail->加载失败
      total: 0,
    };
  },
  methods: {
    statusIsShow(item) {
      if (item.isOverdueBill || item.customStatus === 0 || item.customStatus === 1) {
        return true;
      }
      return false;
    },
    getStatusClassName(item) {
      if (item.customStatus === 0) { // 优先级最高
        return 'default';
      } else if (item.isOverdueBill) {
        return 'overdue';
      } else {
        return 'default';
      }
    },
    getStatusText(item) {
      if (item.customStatus === 0) { // 优先级最高
        return '正在划扣中';
      } else if (item.customStatus === 1) {
        return '划扣失败';
      } else if (item.isOverdueBill) { // 优先级最低
        return '逾期';
      };
      return '';
    },
    handlerClassName(item) {
      const customStatus = item.customStatus;
      if (item.isDoing) { // 正在划扣中
        return 'disabled';
      } else if (item.phase > this.selectPhase * 1) {
        return 'cancel';
      }
      return '';
    },
    pay() {
      const list = this.list;
      if (this.type === 2) { // 提前结清自行处理
        const oneItem = list[0];
        const terms = oneItem.terms;
        this.$emit('pay', {
          phases: terms,
          // repayType: terms.split(',').length > 1 ? '2' : '1',
          money: Number(oneItem.coustomTotal),
        });
        return;
      }
      if (!list || !list.length) {
        this.$store.dispatch('showToast', { text: '未发现订单' });
        // this.$root.$emit('showModal', { type: 'toast', conf: { text: '未发现订单', } });
        return;
      }
      let arr = [];
      const isNotPrePay = this.isNotPrePay;
      if (isNotPrePay) {
        list.forEach((x, i) => {
          const phase = x.phase;
          if (phase <= this.selectPhase) {
            arr.push(phase);
          }
        });
        if (arr.length === 0) {
          this.$store.dispatch('showToast', { text: '还未选择还款期数' });
          return;
        }
      } else {
        arr.push('0');
      }
      // const item = list[0];
      // const repayJson = [{
      //   contractNo: item.contractNo, //合同号
      //   applyid: item.oId, //订单编号
      //   money: this.total * 1,
      //   payType: 'creditLoan', //
      //   phases: arr.join(','), // '5,6,7'
      //   repayType: isNotPrePay ? (arr.length > 1 ? '2' : '1') : '0',
      // }];
      // console.log(repayJson);
      this.$emit('pay', {
        phases: arr.join(','),
        repayType: isNotPrePay ? (arr.length > 1 ? '2' : '1') : '0',
        money: Number(this.total),
      });
    },
    getTitle(item) {
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
    tickSwitch(item) {
      if (item.isDoing) { //正在划扣中
        this.$store.dispatch('showToast', { text: '正在尝试划扣中,不可勾选' });
        return;
      }
      if (!this.isNotPrePay) {
        this.$store.dispatch('showToast', { text: '前置费用不可取消勾选' });
        return;
      }
      if (item.isOverdueBill) { // 逾期
        this.$store.dispatch('showToast', { text: '逾期账单不可取消勾选' });
        // this.$root.$emit('showModal', { type: 'toast', conf: { text: '逾期账单不可取消勾选', } });
        return;
      }
      if (item.type === 1) { // 提前结清
        this.$store.dispatch('showToast', { text: '提前结清不可取消勾选' });
        // this.$root.$emit('showModal', { type: 'toast', conf: { text: '提前结清不可取消勾选', } });
        return;
      }
      const phase = item.phase;
      if (this.selectPhase === phase) {
        this.selectPhase = phase - 1;
      } else {
        this.selectPhase = phase;
      }
      this.calJustify(item);
    }
  },
  created() {
    const list = this.list;
    if (Array.isArray(list)) {
      if (list.length === 0) {
        this.state = 'empty';
        return;
      }
    } else { // 非数组
      this.state = 'fail';
      return;
    }
    this.isNotPrePay = list.isNotPrePay;
    if (!this.isNotPrePay) { // 是否为前置费
      this.total = list[0].frontFee;
      return;
    }
    this.calJustify = () => {
      const list = this.list;
      if (this.type === 2) { // 提前结清
        this.total = (list[0] || {}).coustomTotal || 0;
        return;
      }
      const selectPhase = this.selectPhase;
      if (!list) {
        return;
      }
      let count = 0;
      let greatestPhase = 0;
      list.forEach((x, i) => {
        if (x.isDoing) { //正在划扣中,不参与计算
          return;
        }
        const phase = x.phase || -1;
        // 选中所有小于等于该的期数,提前结清则直接计算
        if (phase <= selectPhase) {
          count += x.shouldTotal * 1;
        }
        if (greatestPhase < phase) {
          greatestPhase = phase;
        }
      });
      if (this.selectPhase > greatestPhase) { // 得到最大的期数
        this.selectPhase = greatestPhase;
      }
      this.total = count.toFixed(2);
    };
    this.calJustify(); // 初始化数据
  },
  directives: {
    initItem: {
      bind(el, v) {
        // console.log(v);
        const { _self, item } = v.value;
        _self.$set(item, 'selected', true);
      }
    }
  }
};

</script>
<style lang="scss" scoped>

.should-repay-bills {
  height: 100%;
  width: 100%;
  position: relative; // padding-top: 0.2rem;
  // position: absolute;
  // top: 0.46rem;
  // bottom: 0;
  // left: 0;
  // right: 0;
  padding-bottom: 0.5rem;
  @include hide-y-scrolbar();
}

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

.bill_pay {
  position: fixed;
  bottom: 0;
  height: 0.5rem;
  line-height: .5rem;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top: 1px solid #ededed;
  padding-left: .14rem;
  overflow: hidden;

  .key {
    color: #757575;
    font-size: 0.15rem;
    display: inline-block;
    line-height: .5rem;
    float: left;
  }

  .value {
    font-family: 'DIN';
    font-size: 0.18rem;
    display: inline-block;
    line-height: .5rem;
    color: #368EFF;
    float: left;
  }
}

.immediate-pay {
  position: absolute;
  background-color: #368EFF;
  line-height: 0.5rem;
  text-align: center;
  color: #fff;
  right: 0;
  top: 0;
  width: 1rem;
  font-size: 0.16rem;
}

</style>
