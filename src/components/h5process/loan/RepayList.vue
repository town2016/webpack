<!-- Picker组件 使用文档：https://github.com/naihe138/vue-picker -->
<template>
  <div id="h-picker" v-if="show">
    <div class="picker-shade">
      <div class="area_ctrl" v-if="show">
        <div class="area_btn_box">
          <div class="title-con">
            <div class="area_btn_title" @click="close" v-if="title">{{title}}</div>
            <div class="area_btn" @click="close"></div>
          </div>
          <div class="item-con">
            <div class="item">
              <div>共借款</div>
              <div class="sec-item">￥{{loanMoney}}元</div>
            </div>
            <div class="item">
              <div>综合日利率</div>
              <div class="sec-item special">{{orderPlan.dayRate}}%</div>
            </div>
            <div class="item">
              <div>借满{{loanTime.split("月")[0]}}个月总利息</div>
              <div class="sec-item">￥{{orderCalculate.repaymentInterest}}元</div>
            </div>
          </div>
          <img class="money-img" :src="require('@/assets/h5processImages/loan/money@2x.png')"
               alt="">
        </div>
        <div class="area_roll">
          <div class="list" v-for="(item,index) in orderPlan.previewRepaymentPlanDTOList"
               :key="index" :data-id='index'>
            <div class="list-date">{{getDate(item.repaymentDate)}}</div>
            <div class="list-info">
              <p class="list-fee">￥{{item.repaymentSumFee}}</p>
              <p class="list-prin">本金￥{{item.repaymentPrincipal}}+利息￥{{(item.repaymentInterest
                + item.manageFee) | format}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    loanMoney: {
      type: [String, Number],
      default: ''
    },
    loanTime: {
      type: String,
      default: ''
    },
    // selectData: {
    //   type: Array,
    //   default: []
    // },
    orderCalculate: {
      type: Object,
      default: {}
    },
    orderPlan: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      pData1: [],
      noData: false
    }
  },
  filters: {
    format(val) {
      return Number(val).toFixed(2);
    }
  },
  methods: {
    close: function(e) {
      this.$emit('cancel')
      e.preventDefault();
    },
    finish: function(e) {
      this.$emit('confirm', e)
      event.preventDefault();
    },
    getDate(time) {
      return new Date(time).getFullYear() + "-" + (new Date(time).getMonth() + 1) + "-" +
        new Date(time).getDate();
    },
    setTop(e) {

    },
    // init() {
    //   this.pData1 = this.selectData;
    // }
  },
  created() {
    // this.init()
  },
  watch: {
    // selectData: {
    //   handler: function () {
    //     this.init()
    //   },
    //   deep: true
    // },
    // orderCalculate: {
    //   handler: function () {
    //     this.init()
    //   },
    //   deep: true
    // },
  }
}
</script>

<style scoped lang='scss'>
#h-picker {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 998;
}

.picker-shade {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
}

.area_ctrl {
  position: absolute;
  left: 0;
  top: 1.2rem;
  bottom: 0;
  margin: 0;
  width: 100%;
  font-size: 12px;
  vertical-align: middle;
  background-color: #fff;
  color: #000;
  z-index: 9901;
  overflow: hidden;
}

.area_btn_box {
  width: 100%;
  height: 1.4rem;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  padding: 0.15rem;
  background-color: rgba(254, 209, 73, 1);
}

.title-con {
  widows: 100%;
}

.sec-item {
  width: .9rem;
  text-align: left;

  &.special {
    padding-left: .03rem;
  }
}

.area_btn{
  position: absolute;
  top: 0.2rem;
  right: 0.15rem;
  width: 0.18rem;
  height: 0.18rem;
  @include bg-image('~@/assets/h5processImages/common/pop-close',center/100% 100% no-repeat);
}


.area_btn_title {
  font-size: 0.18rem;
  font-weight: 500;
  color: rgba(33, 33, 33, 1);
}

.item-con {
  width: 2.2rem;
  margin-top: 0.15rem;
}

.item {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: stretch;
  -webkit-align-items: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  font-size: 0.14rem;
  font-weight: 400;
  color: rgba(33, 33, 33, 1);
  line-height: 0.22rem;
}

.money-img {
  width: 0.74rem;
  height: 0.78rem;
  position: absolute;
  right: 0.2rem;
  bottom: 0;
}

.area_roll {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 1.4rem;
  width: 100%;
  overflow: scroll;
}

.list {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: stretch;
  -webkit-align-items: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  padding: 0 0.2rem;
  margin-top: 0.1rem;
}

.list-date {
  font-size: 0.16rem;
  font-weight: 400;
  color: rgba(33, 33, 33, 1);
  line-height: 0.4rem;
}

.list-info {
  color: rgba(33, 33, 33, 1);
  text-align: right;
}

.list-fee {
  font-size: 0.15rem;
  font-weight: 400;
  color: rgba(33, 33, 33, 1);
  line-height: 0.4rem;
}

.list-prin {
  font-size: 0.12rem;
  font-weight: 400;
  color: rgba(117, 117, 117, 1);
  line-height: 0.2rem;
}
</style>
