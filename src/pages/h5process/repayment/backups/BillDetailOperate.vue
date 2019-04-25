<template>
  <div class="wy-repay">
    <SwitchTabs v-if='tabsConf' :itemsConf='tabsConf' @tabsSwitch="tabsSwitch"></SwitchTabs>
    <TipNavigation v-if='isShowTipNav' v-show='selTab===1' text='提前还清所有账单' @click.native='earlyRepay'></TipNavigation>
    <div class="wy-repay__frame" v-show='selTab===0'>
      <ShouldRepayBills v-if='shouldRepayArrState==="valuable"' :list='shouldRepayArr' @pay='pay'></ShouldRepayBills>
      <ListState v-else :type='shouldRepayArrState'>
        <div class="error-btn" @click='reload'>重新加载</div>
      </ListState>
    </div>
    <div class="wy-repay__frame" :class='{"frame--tip":isShowTipNav}' v-show='selTab===1'>
      <UnpaidBills v-if='unpaidBillsArrState==="valuable"' :list='unpaidBillsArr'></UnpaidBills>
      <ListState v-else :type='unpaidBillsArrState' :textConf='{empty:"暂无未出账单～"}'>
        <div class="error-btn" @click='reload'>重新加载</div>
      </ListState>
    </div>
    <ListState type='fail' v-if='selTab===null'></ListState>
  </div>
</template>
<script>
import {
  ShouldRepayBills,
  UnpaidBills,
  SwitchTabs,
  ListState,
  TipNavigation,
} from '@/components/h5process/repayment';
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'BillDetailOperate',
  components: { SwitchTabs, UnpaidBills, ShouldRepayBills, ListState, TipNavigation },
  data() {
    return {
      tabsConf: null,
      selTab: 0,
    };
  },
  computed: {
    // 本模块
    ...mapGetters('repayment/BillDetailOperate', [
      'shouldRepayArr',
      'unpaidBillsArr',
      'shouldRepayArrState',
      'unpaidBillsArrState',
      'oId',
    ]),
    isShowTipNav() {
      // #@todo 暂时不显示
      return false;

      const shouldRepayArr = this.shouldRepayArr;
      const unpaidBillsArr = this.unpaidBillsArr;
      return shouldRepayArr && shouldRepayArr.isNotPrePay && unpaidBillsArr.length > 0;
    },
  },
  destroyed() {
    // 清除模块数据
    this.clearComponentData();
  },
  methods: {
    ...mapActions(['showToast']),
    ...mapActions('repayment/BillDetailOperate', [
      // 获取订单详情
      'getCreditBillDetail',
      'clearComponentData', //清除模块数据
    ]),
    // ...mapMutations('repayment/BillDetailOperate', [
    //   // 清除模块数据(还原成初始数据)
    //   'CLEAR_WHOLE_DATA',
    // ]),
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
      const tcorderid = this.tcorderid;
      //获取订单详情（初始化数据）
      this.getCreditBillDetail({ tcorderid }).catch((err) => {
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
    const query = this.$route.query;
    const tcorderid = query.tcOrderId;
    const returnUrl = query.returnUrl;
    if (returnUrl) {
      sessionStorage.setItem('returnUrl', returnUrl);
    }

    if (!tcorderid) {
      this.showToast({ text: '非法url' });
      //this.$occurError();
      this.selTab = null;
      return;
    }
    this.tcorderid = tcorderid;
    this.tabsConf = [{ text: '应还账单' }, { text: '未出账单' }];
    this.initData(tcorderid);
    this.tabsSwitch = (index) => {
      let initedItems = this.initedItems;
      this.selTab = index;
      // if (!~initedItems.indexOf(index)) {
      //   initedItems.push(index);
      // }
      // console.log(index);
    };

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
  top: 0.6rem; // .55
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;

  &.frame--tip {
    top: 0.9rem;
  }
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
