<template>
  <div class="repayment-comfirm-bg" v-if="visiable">
    <div class="repayment-comfirm-dialog bg-white">
      <div class="comfirm-title">
        <span class="close-btn" @click="hide">取消</span>
        <span>确认付款</span>
      </div>
      <div class="comfirm-money fz-px-36 font-din">
        ￥{{ totalRepay }}
      </div>
      <div class="account-box flex flex-between" @click="goBankListPages">
        <span class="account-label fc-c1">还款账户</span>
        <span class="account-card flex-vertical-center">
          {{ bankCardList.bankname }}（尾号{{ bankCardList.lastCardno }}）
          <img :src="require('@/assets/images/repayment/arrow_right.png')">
        </span>
      </div>
      <mt-button class="pay-button fc-white" @click="pay" :disabled="btnDisabled">立即支付</mt-button>
    </div>
  </div>
</template>

<script>
  import Api from '@/api';
  import { Toast, Indicator } from 'mint-ui';
  import { mapState } from 'vuex';
  import { query } from '@/utils/common';
  export default {
    name: 'repaymentConfirmDialog',
    props: ['totalRepay', 'repaymentDetail'],
    data() {
      return {
        visiable: false,
        btnDisabled: false
      }
    },
    computed: {
      ...mapState({
        bankCardList(store) {
          let bankCard = store.bankCard.bankCardList;
          bankCard.lastCardno = this.getLast4Number(bankCard.cardno);
          return bankCard;
        }
      })
    },
    methods: {
      // 跳转到切换银行卡。
      goBankListPages() {
        this.$router.push({name: 'bankCardList', query: { token: this.$route.query.token, url: window.location.href }});
      },
      // 获取银行卡列表
      async getBankCardList() {
        try {
          await this.$store.dispatch('queryBankCardList');
        } catch(e) {
          Toast(e)
        }
      },
      // 银行卡后四位
      getLast4Number(cardno) {
        return cardno ? cardno.substr(-4) : '';
      },
      // 本组件向外提供的接口
      show() {
        this.getBankCardList();
        this.visiable = true;
      },
      // 本组件向外提供的接口
      hide() {
        this.visiable = false;
      },
      // 还款
      async pay() {
        try {
          this.btnDisabled = true;

          let repaymentDetail = this.repaymentDetail;

          let params = {
            bankName: this.bankCardList.bankname,
            cardNo: this.bankCardList.cardno,
            payChannel: 2,
            payType: 'creditLoan',
            repaymentListJson: JSON.stringify([
              {
                applyid: repaymentDetail.oId,
                money: this.totalRepay,
                payType: 'creditLoan',
                phases: repaymentDetail.terms,
                repayType: 3
              }
            ])
          }
          let data = await Api.repayment.repayment(params);

          if(data.status === 200 && data.result) {
            Toast({ message: '还款中，请稍后...', duration: 1500 });
            // 跳转到还款成功
            setTimeout(() => {
              this.$router.push({name: 'repaymentSuccess', query: {id: data.result[0].transId, url: query().url}});
            }, 1500)
          } else {
            Toast(data.desc || '还款失败。status: ' + data.status);
            this.btnDisabled = false;
          }
        } catch(e) {
          Toast(e);
          this.btnDisabled = false;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .repayment-comfirm-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 101;
  }
  .repayment-comfirm-dialog {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: pxToRem(423);
  }
  .comfirm-title {
    padding: pxToRem(15) 0;
    border-bottom: 1px solid #eaeaea;
    text-align: center;
  }
  .close-btn {
    position: absolute;
    left: pxToRem(15);
		color: #F7A206;
  }
  .comfirm-money {
    padding: pxToRem(30) 0;
    text-align: center;
  }
  .account-box {
    padding: pxToRem(16) pxToRem(15);
    border-top: 1px solid #eaeaea;
    border-bottom: 1px solid #eaeaea;
  }
  .account-card > img {
    vertical-align: middle;
  }
  .pay-button {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: pxToRem(50);
    border-radius: 0;
    background-color: #F7A206;
  }
</style>
