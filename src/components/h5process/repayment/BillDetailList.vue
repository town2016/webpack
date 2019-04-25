<template>
  <div class="should-repay-bills">
    <BillCell v-if='valuable' v-for='(item,index) in listData' :key='index'
              :cellStyle='cellStyle' :is-prepay='isPrePayFee' :cell-info='item'
              @tickSwitch='$emit("tickSwitch",{index,options:$event})' />

    <ListState v-if='!valuable' :type='realListState' :emptyDesc='emptyDesc'>
      <div class="error-btn" @click='reload'>重新加载</div>
    </ListState>
  </div>
</template>
<script>
import BillCell from '@/components/h5process/repayment/BillDetailListCell.vue';
import ListState from '@/components/h5process/repayment/ListState.vue';

export default {
  name: 'BillDetailList',
  props: {
    listData: { // 列表数据
      required: true,
    },
    isPrePayFee: {
      default: false,
    },
    cellStyle: {
      type: String,
      default: 'shrink',
    },
    listState: {
      required: true,
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['loading', 'valuable', 'fail'].indexOf(value) !== -1
      }
    },
    emptyDesc: {
      default: ''
    },
  },
  components: { BillCell, ListState },
  computed: {
    realListState() {
      const propListState = this.listState;
      const listData = this.listData;
      let isEmpty;
      if (propListState === 'valuable') {
        if (listData && Array.isArray(listData)) {
          isEmpty = listData.length === 0;
        } else {
          return 'fail';
        }
      }
      return isEmpty ? 'empty' : propListState;
    },
    valuable() {
      return this.realListState === "valuable";
    },
    isPrepay() {
      const listData = this.listData;
      return listData ? !listData.isNotPrePay : false;
    }
  },
  methods: {
    reload() {
      this.$emit('reload');
    }
  },
  // mounted() {
  //   console.log(this.realListState)
  // },
  // created() {
  //   // const listData = this.listData || [];
  //   // this.isNotPrePay = listData.isNotPrePay;
  //   // if (!this.isNotPrePay) { // 是否为前置费
  //   //   this.total = listData[0].frontFee;
  //   //   return;
  //   // }
  // },
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
  // padding-bottom: 0.5rem;
  @include hide-y-scrolbar();
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
    display: block;
    line-height: .5rem;
    float: left;
  }

  .value {
    font-family: 'DIN';
    font-size: 0.18rem;
    display: block;
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
</style>