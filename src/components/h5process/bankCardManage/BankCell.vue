<template>
  <!-- :style="{backgroundImage:'url('+bankCellInfo.img+')'}" -->
  <div class="bank-cell">
    <!-- <p :style="{backgroundImage:'url('+necessaryInfo.icon+')'}"></p> -->
    <div class="save-card">
      <BankLogo class="bank-logo" :according='bankInfo.name' @convertBankName='convertBankName'></BankLogo>
      <span>{{bankName}}</span>
    </div>
    <p class="last-fourth" v-html="splitBankCode(this.bankInfo.idCard)"></p>
  </div>
</template>
<script>
import BankLogo from '@/components/BankLogo';

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
    bankInfo: {
      type: Object,
      default: () => ({
        name: '银行',
        idCard: '****************'
      })
    },
  },
  components: { BankLogo },
  data() {
    return {
      bankName: '银行卡'
    }
  },
  methods: {
    splitBankCode(str, index = 0) {
      if (str.length <= (index + 1) * 4) {
        return `${str.substr(index * 4, 4)}`;
      }
      return `${str.substr(index * 4, 4)}&ensp;${this.splitBankCode(str,++index)}`
    },
    convertBankName(bankName) {
      this.bankName = bankName;
    }
  },
};
</script>
<style lang="scss" scoped>
.bank-cell {
  position: relative;
  margin: .2rem auto 0;
  width: 3.45rem;
  height: 1rem;
  background-position: center top;
  background-size: 100% auto;
  background-repeat: no-repeat;
  padding: .13rem .15rem .35rem .25rem;
  color: #212121;
  line-height: 1;
  border-radius: 0.05rem;
  box-shadow: 0 4px 6px 0px rgba(255,254,30, .21);
  @include bg-image('~@/assets/h5processImages/bankcard/bankcard-bg', (center top/100% auto no-repeat, #ffd530));
}

.last-fourth {
  font-size: .23rem;
  font-family: 'DIN';
  text-align: left;
  margin-top: 0.14rem;
}

.save-card {
  font-size: .24rem;
  position: relative;
  // margin-top: .1rem;
  height: 0.35rem;
  line-height: .35rem;
  font-size: .16rem;
  background-size: auto .3rem;
  background-repeat: no-repeat;
  background-position: left center;
  padding-left: .45rem;
  // transform: scale(0.5);
  // transform-origin: 0% 0%;
}

.bank-logo {
  position: absolute;
  left: 0;
  top: 0.02rem;
}
</style>