<!-- 申请车贷页 -->
<template>
  <div class="container">
    <navigation-bar index=3></navigation-bar>

    <div class="form-container">
      <div class="form-row">
        <money-input :value="loanMoney" @input="moneyInput" type="tel" :maxlength="7"
                     :moneyCan='moneyCan' placeholder="请输入借款金额">
          <p slot="desc" class="desc">本次最高可借{{moneyCan}}元，借款金额为100的整数倍</p>
        </money-input>
      </div>
      <div class="form-row" style="border-top:1px solid #ededed">
        <select-input @click.native="selectLoanTime" label="借多久" :value="loanTime"
                      placeholder="请选择">
        </select-input>
        <div class="hairline"></div>
        <select-input label="每月还" :value="orderCalculate.perRepayBalance" placeholder="每月应还金额"
                      @click.native="selectRepayList">
        </select-input>
        <div class="hairline"></div>
        <select-input @click.native="selectLoanBorrow" label="借款用途" :value="loanBorrow"
                      placeholder="请选择">
        </select-input>
        <div class="hairline"></div>
        <select-input :valueImg="bankCard.thirdQueryBind ? bankCard.bankname:''" label="收款账户"
                      :value="(bankCard.thirdQueryBind&&bankCard.bankname)?bankCard.bankname + '(尾号'+ bankCard.cardno.substr(-4) + ')':''"
                      placeholder="请绑定储蓄卡" @click.native="bindCardUrl"
                      :showRightIcon="!(bankCard.thirdQueryBind&&bankCard.bankname)">
        </select-input>
      </div>
    </div>
    <base-button text='确认信息并下一步' :type='submitButtonState' mt='.3rem' @click.native="logicalJudge"></base-button>
    <!-- 选择借多久picker -->
    <picker :show="showLoanTimePicker" :selectData="withdrawRules.termCode" title="借多久"
            @cancel="closePicker" @confirm="confirmLoanTimePicker">
    </picker>
    <!-- 借款用途picker -->
    <picker-use-age :show="showLoanBorrowPicker" :selectData="withdrawRules.loanUse" title="借款用途"
            @cancel="closePicker" @confirm="confirmLoanBorrowPicker">
    </picker-use-age>
    <!-- 每月还 -->
    <repay-list :show="showRepayListPicker" :selectData="withdrawRules.loanUse"
                :orderCalculate="orderCalculate" :orderPlan="orderPlan" :loanMoney="loanMoney"
                :loanTime="loanTime" title="还款计划" @cancel="closePicker">
    </repay-list>

  </div>
</template>

<script>
  import {Indicator, Toast, MessageBox} from "mint-ui";
  import NavigationBar from '@/components/h5process/givingCredit/NavigationBar';
  import BaseButton from '@/components/h5process/base/BaseButton';
  import StatusTips from '@/components/h5process/loan/StatusTips';
  import MoneyInput from "@/components/h5process/input/MoneyInput";
  import SelectInput from '@/components/h5process/loan/SelectInput';
  import TextInput from "@/components/h5process/input/TextInput";
  import Picker from '@/components/h5process/loan/Picker';
  import PickerUseAge from '@/components/h5process/loan/PickerUseAge';
  import RepayList from '@/components/h5process/loan/RepayList';
  import storage from "@/utils/storage";

  import {mapActions, mapGetters, mapState, mapMutations} from 'vuex';
  import {
    PLACE_ORDER,
    GET_ORDER_CALCULATE,
    GET_ORDER_PLAN,
    GET_WITHDRAW_RULES,
  } from "@/store/h5processModules/loan/enum/actionsEnum";
  import {
    CLEAR_ORDER_INFO
  } from "@/store/h5processModules/loan/enum/mutationsEnum";
  import {
    LOAN_INFO,
    ORDER_CALCULATE,
    ORDER_PLAN,
    WITHDRAW_RULES,
  } from "@/store/h5processModules/loan/enum/gettersEnum";
  import {
    GET_FIRST_REPAY_CARD,
    GET_BIND_BANK_CARD_HTTP_REQUEST,
  } from "@/store/h5processModules/bankCard/enum/actionsEnum";
  import {
    BANK_CARD
  } from "@/store/h5processModules/bankCard/enum/gettersEnum";
  import {GET_CONFIG} from "@/store/h5processModules/config/enum/action-types";
  import {GET_EVALUATE_LIMIT_INFO, CLEAR_TIME_OUT} from '@/store/h5processModules/evaluateLimit/enum/actionsEnum';
  import {EVALUATE_LIMIT_INFO} from '@/store/h5processModules/evaluateLimit/enum/gettersEnum';

  export default {
    name: "loanInfo",
    data() {
      return {
        loanMoney: "", // 借多少
        moneyCan: "", // 可借额度
        creditLimit: '', // 最高可借额度

        loanTime: "",
        loanBorrow: "",
        showLoanTimePicker: false, // 是否显示借多久picker
        showLoanBorrowPicker: false, // 是否显示借款用途picker
        showRepayListPicker: false, // 是否展示还款列表
        loanTimeList: [],
        loanUseList: [],
        gpsLocation: {}, // 高德地图定位地址
        repaymentPlanList: [], // 还款计划
        bankCardInfo: {}, // 银行卡信息
        baseConfig: {},
        isLoaning: false,
        currentProcess: ''
      };
    },
    components: {
      NavigationBar,
      MoneyInput,
      SelectInput,
      TextInput,
      Picker,
      PickerUseAge,
      BaseButton,
      RepayList,
      StatusTips,
    },
    computed: {
      buttonClickable() {
        // 确定按钮是否可点击
        return (
          this.loanMoney &&
          this.loanTime &&
          this.loanBorrow &&
          this.bankCard.cardno &&
          this.bankCard.thirdQueryBind
        );
      },
      submitButtonState() {
        return this.buttonClickable ? 'yellow' : 'gray';
      },
      ...mapGetters({
        loanInfo: LOAN_INFO,
        orderCalculate: ORDER_CALCULATE,
        orderPlan: ORDER_PLAN,
        withdrawRules: WITHDRAW_RULES,
        bankCard: BANK_CARD,
        drawDepositInfo: EVALUATE_LIMIT_INFO,
      }),
    },
    watch: {
      async drawDepositInfo(newVal, oldVal) {
        if (newVal.code === 'normal') {
          this.creditLimit = newVal.limit;
          this.loanMoney = this.moneyCan = newVal.available;
          this.initLoanMoney();
        }
      }
    },
    methods: {
      ...mapActions({
        placeOrder: PLACE_ORDER,
        getOrderCalculate: GET_ORDER_CALCULATE,
        getOrderPlan: GET_ORDER_PLAN,
        getWithdrawRules: GET_WITHDRAW_RULES,
        getFirstRepayCard: GET_FIRST_REPAY_CARD,
        getBindCardUrl: GET_BIND_BANK_CARD_HTTP_REQUEST,
        getEvaluateLimitInfo: GET_EVALUATE_LIMIT_INFO,
        getConfig: GET_CONFIG
      }),
      ...mapMutations({
        clearOrderInfo: 'CLEAR_ORDER_INFO'
      }),
      doGetProcessInfo() {
        Indicator.open();
        this.getProcessInfo();
        setTimeout(() => {
          Indicator.close();
        }, 1000)
      },
      bindCardUrl() {
        if (this.bankCard.thirdQueryBind && this.bankCard.cardno) {
          return;
        }
        this.saveLoadTakeDetail();
        //传递当前页面url
        this.getBindCardUrl({callBackUrl: window.location.href});
        // this.getBindCardUrl({callBackUrl: `${window.location.origin}/addBankCard`});
      },
      getLocation() {
        // 获取定位地址
        const mapObj = new AMap.Map("iCenter");
        mapObj.plugin("AMap.Geolocation", () => {
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, // 显示定位按钮，默认：true
            buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          mapObj.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", this.onComplete); // 返回定位信息
          AMap.event.addListener(geolocation, "error", this.onError); // 返回定位出错信息
        });
      },
      // 借款金额输入改变
      moneyInput(val) {
        this.loanMoney = val.toString().replace(/^(0+)|[^\d]+/g, '');
        // 获取生成还款详情
        this.getCreditLoanDetail();
      },
      downApp() {
        window.location.href = this.baseConfig.downloadUrl;
      },
      // 选择借多久
      selectLoanTime() {
        this.showLoanTimePicker = true;
      },
      // 借多久选择结果
      confirmLoanTimePicker(data) {
        this.loanTime = data;
        this.showLoanTimePicker = false;
        // 获取生成还款详情
        this.getCreditLoanDetail();
      },

      // 选择借款用途
      selectLoanBorrow() {
        this.showLoanBorrowPicker = true;
      },
      // 借款用途选择结果
      confirmLoanBorrowPicker(data) {
        this.loanBorrow = data;
        this.showLoanBorrowPicker = false;
      },

      // 查看还款列表
      selectRepayList() {
        if (!(this.loanMoney && this.loanTime)) {
          return;
        }
        this.showRepayListPicker = true;
      },
      // 关闭picker
      closePicker() {
        this.showLoanTimePicker = false;
        this.showLoanBorrowPicker = false;
        this.showRepayListPicker = false;
      },

      // 获取生成还款详情
      async getCreditLoanDetail() {
        if (!this.loanMoney || this.loanMoney == 0 || !this.loanTime) {
          return;
        }
        let params = {
          amount: this.loanMoney,
          term: this.loanTime.replace("期", "M"),
        };
        this.getOrderCalculate(params);
        this.getOrderPlan(params);
      },
      toWithdraw() {
        this.$router.replace("/withdraw");
      },
      toHome() {
        this.$router.replace("/home");
      },
      initLoanMoney() {
        if (storage.read("loadTakeDetail")) {
          let loadTakeDetail = JSON.parse(storage.read("loadTakeDetail"));
          loadTakeDetail.amount && (this.loanMoney = loadTakeDetail.amount);
        } else {
          this.loanMoney = this.moneyCan;
        }
      },
      saveLoadTakeDetail() {
        const loadTakeDetail = {
          amount: this.loanMoney, // 借款金额
          loanUse: this.loanBorrow, // 借款用途
          appType: "H5", // 应用类型
          loanTermCode: this.loanTime, // 借款期数
        };
        storage.write("loadTakeDetail", JSON.stringify(loadTakeDetail));
      },
      // 下一步
      logicalJudge() {
        if (!this.buttonClickable) {
          return
        }
        console.log(Number(this.loanMoney) % 100);
        if (isNaN(this.loanMoney)) {
          Toast("输入金额必须为纯数字");
          return;
        } else if (Number(this.loanMoney) % 100 !== 0) {
          Toast("请输入100的整数倍");
          return;
        } else if (Number(this.loanMoney) < 500) {
          Toast("单笔借款金额最低500元");
          return;
        } else if (Number(this.loanMoney) > 200000) {
          Toast("单笔借款金额最高200000元");
          return;
        }

        // 借款金额超过其可借额度,提示确定 把input金额重置为其可借额度
        if (Number(this.loanMoney) > Number(this.moneyCan)) {
          MessageBox({
            title: "",
            message: `你的剩余可借额度为<br/><span style="color: red">${
              this.moneyCan
              }元</span><br/>请修改借款额度`,
            showCancelButton: true,
            showCancelButton: false
          }).then(() => {
            this.loanMoney = this.moneyCan;
          });
          return;
        }
        this.saveLoadTakeDetail();
        this.$router.push("/baseInfo");
      }
    },
    created() {
      if (storage.read("loadTakeDetail")) {
        let loadTakeDetail = JSON.parse(storage.read("loadTakeDetail"));
        loadTakeDetail.loanUse && (this.loanBorrow = loadTakeDetail.loanUse);
        loadTakeDetail.loanTermCode && (this.loanTime = loadTakeDetail.loanTermCode);
        // 获取生成还款详情
        loadTakeDetail.amount && loadTakeDetail.loanTermCode && this.getCreditLoanDetail();
      }
    },
    async mounted() {
      // 调用获取支用规则
      this.getWithdrawRules();

      // 获取银行卡信息
      !(this.bankCard && this.bankCard.bankname) && this.getFirstRepayCard();

      // 获取出额信息，如vuex中有，优先取vuex中的值，如没有，重新请求
      if (this.drawDepositInfo && this.drawDepositInfo.available) {
        this.creditLimit = this.drawDepositInfo.limit;
        this.moneyCan = this.drawDepositInfo.available;
        this.initLoanMoney();
      } else {
        this.getEvaluateLimitInfo();
      }
    },
    beforeDestroy() {
      this.clearOrderInfo();
    }
  };
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.6rem;
  }

  .form-container {
    margin: 0.15rem;
    background-color: #fff;
  }

  .form-row {
    margin-top: 0.2rem;
    background-color: #fff;
  }

  .desc {
    font-size: 12px;
    color: rgb(117, 117, 117);
  }

  .footer-btn {
    display: flex;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
  }

  .btn-login {
    flex: 1;
    height: 0.5rem;
    border-radius: 0;
    /* background-color: #f7a206; */
  }

  .hairline {
    border-top: 1px solid rgb(231, 231, 231);
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    margin-left: 0.15rem;
  }

  .allRepay {
    text-align: right;
    margin-right: 0.12rem;
    height: 0.3rem;
    line-height: 0.3rem;
    color: #26a2ff;
  }

  .studentTips {
    position: fixed;
    left: 0;
    bottom: 0.5rem;
    margin: 10px 0;
    color: red;
    font-size: 14px;
    text-align: center;
    width: 100%;
  }

  .inviteman-input .leftLabel {
    color: rgb(33, 33, 33) !important;
  }

  .inviteman-input .input {
    text-align: right;
    margin-right: 0.15rem !important;
  }

  .search-input {
    width: 2.5rem;
    padding-left: 0.15rem;
  }

  .search-input .input {
    background-color: #efefef;
    border-radius: 0.4rem;
  }

  .close {
    padding: 0.12rem 0.15rem;
  }

  .close p {
    font-size: 17px;
    color: #0575f2;
  }

  .item-container {
    width: 100%;
    padding: 0.5rem 0.15rem 0 0.15rem;
  }

  .evaluating-tips {
    font-size: 0.16rem;
    font-weight: 400;
    color: rgba(33, 33, 33, 1);
    line-height: 0.3rem;
    text-align: center;
    margin-top: 0.1rem;
  }

  .evaluating-info {
    font-size: 0.14rem;
    font-weight: 400;
    color: rgba(117, 117, 117, 1);
    line-height: 0.2rem;
    text-align: center;
  }

  .getlimit {
    position: relative;
  }

  .getlimit-bg {
    width: 100%;
    display: block;
  }

  .getlimit-info {
    position: absolute;
    width: 1.5rem;
    height: 1.2rem;
    top: 0.6rem;
    right: 0.3rem;
  }

  .getlimit-intro {
    position: absolute;
    width: 1.5rem;
    top: 0.8rem;
    left: 0.4rem;
  }

  .getlimit-img,
  .ruoju-img,
  .qiangju-img {
    margin: 0 auto;
    width: 1.59rem;
    height: 1.56rem;
    display: block;
  }
</style>
