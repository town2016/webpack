<template>
  <div class="wy-repay">
    <TipNavigation v-if='!hasInitedError || isShowTipNav' text='提前还清所有账单' @click.native='earlyRepay'></TipNavigation>
    <div class="wy-repay__frame" v-if='!hasInitedError'>
      <div class="unpaid-bills" v-if='unpaidBillsArrState==="valuable"'>
        <div class="unpaid-banner">
          <p class="value">{{total}}</p>
          <p class="des">当前应还金额（元）</p>
          <p class="value">{{restPhase}}</p>
          <p class="des">剩余期数（月）</p>
        </div>
        <div class="bill" v-for='(item,index) in unpaidBillsArr' :key='index'>
          <div class="bill-header"><span>{{getMonth(item.shouldRepayDate)}}月账单</span><span class="specific">{{(item.shouldTotal*1).toFixed(2)}}元</span></div>
          <div class="bill-body">
            <p>最后还款日：{{item.shouldRepayDate}}</p>
          </div>
        </div>
      </div>
      <ListState v-else :type='unpaidBillsArrState' :textConf='{empty:"暂无未出账单～"}'>
        <div class="error-btn" @click='reload'>重新加载</div>
      </ListState>
    </div>
    <ListState type='fail' v-else></ListState>
  </div>
</template>
<script>
import {
  ShouldRepayBills,
  UnpaidBills,
  SwitchTabs,
  ListState,
  TipNavigation,
} from '@/components/iqiyi/repayment';
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'BillDetailSearch',
  components: { SwitchTabs, UnpaidBills, ShouldRepayBills, ListState, TipNavigation },
  data() {
    return {
      tabsConf: null,
      hasInitedError: false,
    };
  },
  computed: {
    // 本模块
    ...mapGetters('Repayment/BillDetailSearch', [
      'shouldRepayArr',
      'unpaidBillsArr',
      'shouldRepayArrState',
      'unpaidBillsArrState',
      'oId',
    ]),
    isShowTipNav() {
      // #@todo 暂时不显示
      return true;

      const shouldRepayArr = this.shouldRepayArr;
      const unpaidBillsArr = this.unpaidBillsArr;
      return shouldRepayArr && shouldRepayArr.isNotPrePay && unpaidBillsArr.length > 0;
    },
    restPhase() {
      const list = this.unpaidBillsArr;
      return Array.isArray(list) ? list.length : 0;
    },
    total() {
      const list = this.unpaidBillsArr;
      if (!Array.isArray(list)) {
        return '0.00';
      }
      let count = 0;
      list.forEach((x) => {
        count += x.shouldTotal * 1;
      });
      return count.toFixed(2);
    }
  },
  destroyed() {
    // 清除模块数据
    this.clearComponentData();
  },
  methods: {
    ...mapActions(['showToast']),
    ...mapActions('Repayment/BillDetailSearch', [
      // 获取订单详情
      'getCreditBillDetail',
      'clearComponentData', //清除模块数据
    ]),
    // ...mapMutations('repayment/BillDetailOperate', [
    //   // 清除模块数据(还原成初始数据)
    //   'CLEAR_WHOLE_DATA',
    // ]),
    getMonth(date) {
      try {
        const month = date.match(/\d{1,4}/g)[1];
        return month.length === 2 ? month : 0 + month;
      } catch (err) {
        return '00';
      }
    },
    earlyRepay() { // 提前结清
      this.$router.push({ path: `/EarlyBillsRepay/${this.oId}` });
      console.log('earlyRepay');
    },
    reload() {
      this.initData();
    },
    pay({ phases, repayType, money }) {
      const repayJson = [{
        contractNo: this.shouldRepayArr[0].contractNo, //合同号
        applyid: this.oId, //订单编号
        money,
        payType: 'creditLoan', //
        phases, // '5,6,7'
        repayType,
      }];
      console.log(repayJson);
      // sessionStorage.setItem('repayJsonStr', JSON.stringify(repayJson)); // this.$router.push('/pay');
      // const repaymentListJson = [{
      //   applyid: "143045481994255773",
      //   contractNo: "143045482391059896",
      //   money: '3029.2',
      //   payType: "creditLoan",
      //   phases: "1",
      //   repayType: "1",
      // }];
      // const money = (repaymentListJson[0].money * 1).toFixed(2);
      const jsonStr = JSON.stringify(repayJson);
      sessionStorage.setItem('repayJsonStr', JSON.stringify({
        repaymentListJson: jsonStr,
        money,
      }));

      this.$router.push('/OrderPay');
    },
    initData() {
      const orderId = this.orderId;
      //获取订单详情（初始化数据）
      this.getCreditBillDetail({ orderId }).catch((err) => {
        const { errStatus } = err;
        if (errStatus === 2) { // 未实名
          this.showToast({ text: '未发现实名绑卡信息,请先实名绑卡' });
          // console.dir(err);
          // this.$router.go(-1);
        } else if (errStatus === 1) {
          // 该订单不存在
          this.showToast({ text: '该订单不存在' });
        }
        if (process.env.NODE_ENV === "development")
          throw err;
      });
    }
  },
  created() {
    const orderId = this.$route.params.oId;
    // const returnUrl = query.returnUrl;
    // if (returnUrl) {
    //   sessionStorage.setItem('returnUrl', returnUrl);
    // }
    if (!orderId) {
      this.showToast({ text: '非法订单号' });
      //this.$occurError();
      this.hasInitedError = true; // 加载失败
      return;
    }
    this.orderId = orderId;
    this.tabsConf = [{ text: '应还账单' }, { text: '未出账单' }];
    this.initData(orderId);

    const doc = document;
    let body = doc.querySelector('body');
    body.style.paddingTop = '8px';
    body.style.boxSizing = 'content-box';
    doc.documentElement.scrollTop = 8;
    doc.body.scrollTop = 8;
    window.onscroll = () => {
      doc.documentElement.scrollTop = 8;
      doc.body.scrollTop = 8;
    }
  },
  beforeDestroy() {
    let body = document.querySelector('body');
    body.style.paddingTop = '0px';
    body.style.boxSizing = 'border-box';
    window.onscroll = null;
  },
};
</script>
<style lang="scss" scoped>
.wy-repay {
  width: 100%;
}

.wy-repay__frame {
  position: absolute;
  top: 0.5rem;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
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


.unpaid-bills {
  // padding-top: 0.15rem;
  position: absolute;
  top: 0rem;
  bottom: 0;
  left: 0;
  right: 0;
  @include hide-y-scrolbar();
}

.unpaid-banner {
  height: 1.6rem;
  width: 3.45rem;
  margin-left: 0.15rem;
  border-radius: 5px;
  @include bg-image('~@/assets/images/repay/unpaid_bg');
  background-size: 100% 100%;
  margin-bottom: 0.15rem;
  padding: 0 20px;
  overflow: hidden;
  color: #fff;
  line-height: 1;

  .value {
    padding-top: 0.2rem;
    font-family: 'DIN';
    font-size: .31rem;
  }

  .des {
    margin-top: 0.05rem;
    font-size: .13rem;
  }
}

.bill {
  background-color: #fff;
}

.bill-header {
  font-size: .16rem;
  padding-left: 0.15rem;
  height: .4rem;
  line-height: .4rem;
  overflow: hidden;
  color: #212121;
}

.specific {
  float: right;
  margin-right: .15rem;
}

.bill-body {
  padding: 0 0 .15rem .15rem;
  font-size: .14rem;
  border-bottom: 1px solid #ededed;

  p {
    margin-bottom: .12rem;
    color: #757575;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>