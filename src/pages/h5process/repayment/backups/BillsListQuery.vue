<template>
  <div class="my-bills" v-if='billsOrder&&billsOrder.length'>
    <div class="should-replay">
      <p class="cash">{{repayTotal}}</p>
      <p class="des">当前应还金额（元）</p>
    </div>
    <p class="borrow">装修消费 ({{billsOrder.length}})</p>
    <ul class="bills-list">
      <li v-for='(item) in billsOrder' :key="item.id">
        <div class="description"><span class="period" v-if='item.currentPhase!==0'>{{item.loanTime + '-' + item.displayPhase}}期 | </span><span :class="{overdue:item.status===2}">{{item.textState}}</span><span class="money">{{item.repayDueCapital}}元</span></div>
        <p class="terms">金额期数：{{item.repayTotCapital}}元（{{item.displayPhase}}/{{item.phase}}期）</p>
        <p class="deadline">最后还款日：{{item.currentPhase===0?dueDate(item.loanTime):filterDate(item.lastTime,'-')}}</p>
        <div class="wy_repay" :class='{repayed:item.status===3}' @click='skip(item.oid)'>{{item.status===3?'查看':'还款'}}</div>
      </li>
    </ul>
  </div>
  <div v-else-if='billsOrder' class="my-bills empty">
    <div class="empty-icon"></div>
    <p>当前无账单</p>
    <BaseButton :style="{width: '2.45rem'}" text='极速借款' @click.native='borrow' type='blue' mt='.3rem'></BaseButton>
  </div>
</template>
<script>
import { filterDate } from "@/utils/helpers";
import { Toast, Indicator } from "mint-ui";
import cookie from "@/utils/cookie";
import BaseButton from "@/components/h5process/repayment/BaseButton.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "BillsListQuery",
  components: { BaseButton },
  computed: {
    ...mapGetters("Repayment/BillsListQuery", {
      billsOrder: "BILLS_ORDER",
      repayTotal: "REPAY_TOTAL"
    })
    // ...mapActions({test:'billsListQuery/getCreditOrderList'})
  },
  methods: {
    ...mapActions("Repayment/BillsListQuery", ["getCreditOrderList"]),
    // getPhase(item) {
    //   //逾期则返回已付账单加1
    //   return (
    //     (item.status === 2 ? item.repaidPhase + 1 : item.currentPhase) || 0
    //   );
    // },
    borrow() {
      this.$router.push("/home");
    },
    skip(order) {
      if (!order) {
        Toast("未获取到对应订单,请联系客服");
        return;
      }
      this.$router.push({ name: "repayment", params: { order } });
    },
    dueDate(v) {
      let exc = v.substr(-2, 2) * 1 + 3;
      exc = exc < 10 ? "0" + exc : exc;
      return v.substring(0, 4) + "-" + v.substring(4, 6) + "-" + exc + "后失效";
    },
    //账单状态1.正常 2. 逾期 3. 结清
    // calState(status) {
    //   return status === 3 ? "当前已还" : status === 2 ? "已逾期" : "待还款";
    // },
    filterDate(timeStamp, splitStr) {
      if (!timeStamp) {
        return "0000-00-00";
      }
      timeStamp = timeStamp.replace(/[a-z]+.*$/i, "");
      if (isNaN(timeStamp * 1)) {
        return timeStamp;
      }
      return filterDate(timeStamp, splitStr);
    }
  },
  activated() {
    //第一次created也会执行
    // console.log('activated', this._inactive);
    // this.$store.dispatch('setCommonConfig', { showTabbar: true, });
    //获取订单->dispatch
    this.getCreditOrderList().catch(err => {
      console.log(err);
      if (!this.firstLoad) {
        //第一次加载
        this.$occurError(err);
        this.firstLoad = true;
      }
    });
  }
  // deactivated(){
  //  console.log('deactivated',this._inactive);
  // },
  //created() { console.log(this.$store, this, this._inactive); },
  // destroyed(){
  //     console.log('destroy');
  // }
};
</script>
<style lang="scss" scoped>
.my-bills {
  width: 100%;
  height: calc(100% - 0.51rem);
  @include hide-y-scrolbar();
  background-color: rgb(244, 244, 244);
}

.borrow {
  font-size: 0.14rem;
  color: #757575;
  margin: 0.15rem 0 0.17rem 0.16rem;
}

.bills-tip {
  position: fixed !important;
  left: 0;
  right: 0;
  z-index: 999;
}

.should-replay {
  height: 1.15rem;
  width: 3.45rem;
  margin: 0.1rem 0 0 0.15rem;
  border-radius: 5px;
  @include bg-image("~@/assets/images/repay/bg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #fff;
  text-align: center;

  .cash {
    font-family: "DIN";
    font-size: 0.36rem;
    padding-top: 0.22rem;
  }

  .des {
    margin-top: 0.05rem;
    font-size: 0.13rem;
  }
}

.empty {
  text-align: center;
  color: #757575;
  padding-top: 0.8rem;
}

.empty-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin: 0 auto;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("~@/assets/images/repay/empty.svg");
}

.bills-list {
  li {
    height: 1.05rem;
    background-color: #fff;
    margin-bottom: 15px;
    padding-left: 0.15rem;
    padding-right: 0.12rem;
    position: relative;
  }

  .description {
    overflow: hidden;
    line-height: 0.2rem;
    height: 0.32rem;
    padding-top: 0.12rem;
    color: #212121;
    padding-left: 0.25rem;
    background: url(~@/assets/images/repay/repay.svg) left 0.12rem/0.18rem auto no-repeat;

    .money {
      float: right;
    }

    .overdue {
      color: #f33f3d;
    }
  }

  .terms,
  .deadline {
    color: #757575;
    font-size: 0.13rem;
  }

  .terms {
    line-height: 0.38rem;
  }

  .wy_repay {
    position: absolute;
    bottom: 0.14rem;
    right: 0.12rem;
    background-color: #368eff;
    width: 0.75rem;
    height: 0.24rem;
    line-height: 0.24rem;
    border-radius: 0.12rem;
    color: #fff;
    font-size: 0.13rem;
    text-align: center;

    &.repayed {
      background-color: #fff;
      color: #368eff; // border:1px solid #368EFF;

      &::after {
        @include border(full, #368eff, 0.12rem);
      }
    }
  }
}
</style>