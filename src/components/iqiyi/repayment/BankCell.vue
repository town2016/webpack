<template>
  <div class="bank-cell" :style="{backgroundImage:'url('+bankCellInfo.img+')'}">
    <p class="bank-name">{{bankCellInfo.fullName}}</p>
    <p class="save-card">储蓄卡</p>
    <p class="last-fourth">{{bankCellInfo.bankFourDigits}}</p>
    <div v-if='bankCellInfo.curBankState' class="state" :class='{spe:type==="selectabled"}'>{{bankCellInfo.curBankState===1?'未完成确认':'未绑定存管'}}</div>
    <div class="handler" v-if='type==="selectabled"' :class='{cancel:!selected}' @click='selHanlder'></div>
  </div>
</template>
<script>
//import { filterBankByKey } from '@/utils/bankList.js';
export default {
  name: 'BankCell',
  props: {
    /**
     * [当前银行卡信息]
     * @type {Object}
     * @property {String required} bankName  银行名称
     * @property {String | Number required} bankFourDigits 银行卡号后4位
     * @property {Number required} curBankState 当前银行卡状态,0->OK,1->未完成确认,2->未绑定存管
     */
    bankCellInfo: {
      required: true,
      type: Object,
    },
    selected: { //是否选中
      required: true,
      type: Boolean,
    },
    /**
     * [该组件的可选类型]
     * @type {String}
     * @range ['selectabled','none']
     * @value selectabled 可选中
     * @value none 不可选中
     */
    type: {
      type: String,
      default: 'none',
    }
  },
  methods: {
    selHanlder() {
      this.$emit('selHanlder'); //选中
    },
  },
};

</script>
<style lang="scss" scoped>
.bank-cell {
  position: relative;
  margin: .2rem auto 0;
  width: 3.45rem;
  height: 1.4rem;
  background-position: center top;
  background-size: 100% auto;
  background-repeat: no-repeat;
  padding: .25rem .15rem .35rem .6rem;
  color: #fff;
  line-height: 1;
  background-color: #368EFF;
  border-radius: 0.05rem;
}

.bank-name {
  font-size: .15rem;
}

.last-fourth {
  font-size: .23rem;
  font-family: 'DIN';
  text-align: right;
  margin-top: 0.1rem;
}

.save-card {
  font-size: .24rem;
  margin-top: .1rem;
  transform: scale(0.5);
  transform-origin: 0% 0%;
}

.state {
  width: .95rem;
  height: .22rem;
  line-height: .23rem;
  position: absolute;
  top: .22rem;
  right: .16rem;
  color: #FF0300;
  font-size: .12rem;
  padding-left: .25rem;
  background: url(~@/assets/images/repay/no-sure.svg)center/auto 100% no-repeat;
  &.spe {
    right: .4rem;
  }
}

.handler {
  position: absolute;
  right: .1rem;
  top: 0.2rem;
  width: 0.25rem;
  height: 0.25rem;
  background: url(~@/assets/images/repay/tick-white.svg) center/0.22rem auto no-repeat;
  &.cancel {
    background-image: url(~@/assets/images/repay/cancel_tick.svg);
  }
}

</style>
