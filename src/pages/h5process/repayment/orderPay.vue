<template>
  <div class="ensure-pay">
    <div class="amount">￥{{moneyTotal}}</div>
    <LinePlace desc='还款明细' :value='textValue' :arrow='true' @click.native='searchDetail'></LinePlace>
    <LinePlace desc='付款账户'>
      <template slot='value'>
        <BankLogo class="bank-icon" :according='according' @convertBankName='convertBankName'></BankLogo>
        <div class="bank-info">{{bankString}}</div>
      </template>
    </LinePlace>
    <BaseButton text='确认付款' type='yellow' mt='.3rem' @click.native='pay'></BaseButton>
    <div class="download fz-px-14" v-if='globalConfig&&globalConfig.isAdvertEnabled'>
      若需更换付款银行卡，请前往<span @click='trunInApp'>金象钱包App</span>
    </div>
  </div>
</template>
<script>
import BaseButton from '@/components/h5process/base/BaseButton';
import LinePlace from '@/components/LinePlace/PrimaryLine';
import BankLogo from '@/components/BankLogo';
// import CheckCode from '@/components/h5process/bankCardManage/CheckCode.vue';
import { mapActions, mapGetters } from 'vuex';
// import { checkTelephone } from '@/utils/helpers';
// import { CARD_AGREEMENT } from '@/store/modules/bankCard/enum/gettersEnum';
// import { GET_CARD_AGREEMENT } from '@/store/modules/bankCard/enum/actionsEnum';

export default {
  name: 'orderPay',
  components: { BaseButton, LinePlace, BankLogo },
  data() {
    return {
      // telephone: '',
      // checkcode: '',
      extraBankName: '',
      globalConfig: null
    };
  },
  computed: {
    ...mapGetters('repayment/orderPay', ['moneyTotal', 'phaseTotal', 'cardNo',
      'bankName', 'isPrePayFee'
    ]),
    // ...mapGetters({
    //   cardAgreement: CARD_AGREEMENT, // 绑卡协议链接url地址
    // }),
    according() {
      return this.bankName || '';
    },
    bankString() {
      const extraBankName = this.extraBankName;
      const cardNo = this.cardNo;
      if (cardNo && extraBankName) {
        return `${extraBankName} (尾号${cardNo.substr(-4,4)})`;
      }
      return ''
    },
    textValue() {
      const isPrePayFee = this.isPrePayFee;
      const phaseTotal = this.phaseTotal;
      if (isPrePayFee) {
        return '前置服务费';
      } else {
        return `共${phaseTotal}期`;
      }
    }
  },
  methods: {
    ...mapActions(['showToast', 'GET_CONFIG']),
    ...mapActions('repayment/orderPay', ['initPageInfo', 'paySelectedOrder']),
    convertBankName(bankName) {
      this.extraBankName = bankName;
    },
    searchDetail() {
      const order = this.$route.query.order;
      const query = order ? { order } : {};
      this.$router.push({ path: `/repayDetail/${this.type}`, query });
      // this.$router.push(`/repayDetail/${this.type}`);
    },
    trunInApp() {
      console.log('app引流');
      const { downloadUrl } = this.globalConfig;
      location.href = downloadUrl;
      // try {
      //   const { downloadUrl } = await this.GET_CONFIG();
      //   location.href = downloadUrl;
      // } catch (err) {
      //   this.showToast({ text: '跳转失败,请稍后重试' });
      // }
    },
    async pay() {
      await this.paySelectedOrder();
      sessionStorage.setItem('status', 200);
      sessionStorage.setItem('routerPath', '/home');
      this.$router.replace('/succeedToPay');
    },
    async getGlobalConfig(needToast) {
      if (this.globalConfig) {
        return this.globalConfig;
      }
      try {
        this.globalConfig = await this.GET_CONFIG();
      } catch (err) {
        this.showToast({ text: '获取配置失败，请稍后重试' });
      }
    }
  },
  created() {
    const type = this.$route.params.type;
    const order = this.$route.query.order;
    this.type = type;
    this.initPageInfo({ type, order }).catch((err) => {
      console.log(err)
      const { _code = null, _desc: text = null } = err;
      if (_code === 404 || _code === 501) {
        // 未发现订单信息 或者 解析参数失败(非法url)
        this.showToast({ text });
        this.$router.replace('/home');
      } else {
        // 后端返回错误
        this.$occurError(err);
      }
    });
    this.getGlobalConfig(false);
  }
};
</script>
<style lang="scss" scoped>
.ensure-pay {
  width: 100%;
  font-size: .15rem;
}

.agree-pay {
  width: 100%;
}

.protocal {
  font-size: .15rem;
  margin: .20rem .15rem;
  color: rgb(117, 117, 117);

  span {
    color: rgb(54, 142, 255);
  }
}

.amount {
  height: 1.2rem;
  line-height: 1.2rem;
  font-size: 0.36rem;
  color: #212121;
  text-align: center;
  background-color: #fff;
  border-bottom: 1px solid #f3f3f3;
}


.bank-icon {
  float: left;
  margin-top: .07rem;
  // height: 100%;
  // width: .34rem;
}

.bank-info {
  float: left;
  margin-left: .1rem;
}

.b-t-1 {
  border-top: 1px solid #f3f3f3;
}

.pr100 {
  padding-right: pxToRem(100px);
}

.input-area {
  height: 0.45rem;
  line-height: 0.45rem;
  width: 100%;
  display: flex;
  flex-flow: row no-wrap;
  background-color: #fff;
  padding-left: .16rem;
  position: relative;

  .input {
    flex: 1;
    border: none;
    outline: none;
    min-width: 0;

    &::-webkit-input-placeholder {
      color: #C1C1C1;
    }
  }

  .des {
    color: #212121;
    padding-right: 0.1rem;
  }
}

.download {
  padding: 0.2rem 0;
  line-height: 0.2rem;
  position: fixed;
  width: 100%;
  left: 0;
  text-align: center;
  bottom: 0;

  span {
    color: #368EFF;

    &:active,
    &:hover,
    &:link,
    &:visited {
      color: #368EFF;
    }
  }
}
</style>