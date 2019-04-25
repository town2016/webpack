<template>
  <div class="repayment-list bg-white" @click="checkItem">
    <div class="list-title flex">
      <img class="title-check-img" :src="require('@/assets/images/repayment/check.png')" width="22" height="22" v-if="item.checked" />
      <img class="title-check-img" :src="require('@/assets/images/repayment/uncheck.png')" width="22" height="22" v-if="!item.checked" />
      <span class="flex-grow-1">{{ date }}月账单</span>
      <span>{{ item.shouldTotal }} 元</span>
    </div>
    <ul class="list-detail fc-75 fz-px-14">
      <li class="detail-item" v-if="item.shouldRepayAmt">应还本金： {{ toFixed2(item.shouldRepayAmt) }} 元</li>
      <li class="detail-item" v-if="item.shouldInterest">应还利息： {{ toFixed2(item.shouldInterest) }}元</li>
      <li class="detail-item" v-if="item.accountMgmtFee">管理费： {{ toFixed2(item.accountMgmtFee )}} 元</li>
      <li class="detail-item" v-if="item.dueConsultFee">信息费： {{ toFixed2(item.dueConsultFee)}} 元</li>
      <li class="detail-item" v-if="item.dueServiceFee">服务费： {{ toFixed2(item.dueServiceFee)}} 元</li>
      <li class="detail-item" v-if="item.frontOvdDueFee">咨询服务逾期费： {{ toFixed2(item.frontOvdDueFee) }} 元</li>
      <li class="detail-item" v-if="item.ovdDueFee">逾期违约金： {{ toFixed2(item.ovdDueFee) }} 元</li>
      <li class="detail-item" v-if="item.overdueInterest">逾期利息： {{ toFixed2(item.overdueInterest) }} 元</li>
      <li class="detail-item" v-if="item.prepayTotFee">提前还款应收违约金总额： {{ toFixed2(item.prepayTotFee) }} 元</li>
      <li class="detail-item" v-if="item.repayDueFront">剩余应还前置费用： {{ toFixed2(item.repayDueFront) }} 元</li>
      <li class="detail-item" v-if="item.totVisitFee">应还催收费： {{ toFixed2(item.totVisitFee) }} 元</li>
      <li class="detail-item" v-if="item.totWithdrawFailedFee">应还扣款失败手续费： {{ toFixed2(item.totWithdrawFailedFee) }} 元</li>
      <li class="detail-item" v-if="item.towCarFee">管理费： {{ toFixed2(item.towCarFee) }} 元</li>
      <li class="detail-item" v-if="item.visitFee">上门费： {{ toFixed2(item.visitFee) }} 元</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'repaymentList',
    props: ['item'],
    data() {
      return {
        
      }
    },
    computed: {
      date() {
        let time = this.item.shouldRepayDate;
        time = time.replace(/-/g,':').replace(' ',':');
        time = time.split(':');
        let d = new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5]);
        return d.getMonth()+1;
      }
    },
    methods: {
      toFixed2(number) {
        return number.toFixed(2); 
      },
      checkItem() {
        // this.item.checked = !this.item.checked;
        this.$emit('checked', this.item);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .repayment-list {
    margin-bottom: pxToRem(14);
  }
  .list-title {
    padding: pxToRem(10) pxToRem(15) pxToRem(11) pxToRem(15);
    border-bottom: 1px solid #eaeaea;
  }
  .title-check-img {
    padding-right: pxToRem(7);
    width: pxToRem(22);
    height: pxToRem(22);
  }
  .list-detail {
    padding: pxToRem(15) pxToRem(47) pxToRem(15) pxToRem(44);
  }
  .detail-item:not(:last-child) {
    margin-bottom: pxToRem(15);
  }
</style>


