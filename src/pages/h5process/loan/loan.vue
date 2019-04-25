<!-- 申请车贷页 -->
<template>
  <div class="container">

  </div>
</template>

<script>
  import {Indicator} from "mint-ui";
  import NavigationBar from '@/components/h5process/givingCredit/NavigationBar';
  import {mapActions, mapGetters} from 'vuex';

  import {GET_ORDER_STATUS} from "@/store/h5processModules/loan/enum/actionsEnum";
  import {ORDER_STATUS} from "@/store/h5processModules/loan/enum/gettersEnum";

  export default {
    name: "loan",
    components: {
      NavigationBar
    },
    data() {
      return {
        baseConfig: {}
      };
    },
    computed: {
      ...mapGetters({
        orderStatus: ORDER_STATUS
      }),
    },
    watch: {
      orderStatus(newVal, oldVal) {
        if (newVal.code == 0 || newVal.code == 13) {
          this.goLoanInfo();
        } else {
          this.goLoanResult();
        }
      }
    },
    methods: {
      ...mapActions({
        getOrderStatus: GET_ORDER_STATUS
      }),
      goLoanInfo() {
        this.$router.replace("/loanInfo");
      },
      goLoanResult() {
        this.$router.replace("/loanResult");
      }
    },
    async created() {
      // 获取订单状态
      Indicator.open();
      this.getOrderStatus();
      setTimeout(() => {
        Indicator.close();
      }, 1000)
    }
  };
</script>

<style scoped>
  .container {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
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

