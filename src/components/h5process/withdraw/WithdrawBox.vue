<template>
<div class="withdraw-box bg-white p-t-15 p-l-15">
  <p class="fc-21 fz-px-15">{{title}}</p>
  <p class="amount-layout" >
    <span class="fc-75 fz-px-13 yen">&yen;</span>
    <span class="fc-21 fz-px-36 font-din">{{ numberFormat(money) }}</span>
    <span class="fc-75 fz-px-13" v-show="moneyState !== ''">（{{moneyState}}）</span>
  </p>
  <p class="fc-75 fz-px-12 m-t-10 m-b-10"><slot/></p>
</div>
</template>
<script>
import numberComma from '@/utils/numberComma';
export default {
  name: "WithdrawBox",
  props: {
    title: {
      type: String,
      default: '提现金额'
    },
    // money: Number,
    money: String,
    moneyState: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  methods: {
    numberFormat(number) {
			return numberComma(number);
    }
  }
}
</script>
<style lang="scss" scoped>
.withdraw-box {
  position: relative;
  overflow: hidden;
}

.yen {
  font-family:Arial;
}

.amount-layout {
  border-bottom: 1px solid #e7e7e7;
  padding: pxToRem(14) 0 pxToRem(9) 0;
}

</style>
