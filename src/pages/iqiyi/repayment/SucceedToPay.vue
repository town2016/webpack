<template>
  <div class="wrap">
    <div class="top">
      <p class="submit-suc">还款提交成功</p>
      <p class="evaluate">预计还款划扣时间30分钟</p>
    </div>
    <!-- <BaseButton text='继续划扣' @click.native='turn' type='blue' mt='.15rem'></BaseButton> -->
    <BaseButton text='完成' @click.native='complete' type='blue' mt='.2rem'></BaseButton>
  </div>
</template>
<script>
import { BaseButton } from '@/components/iqiyi/repayment';
export default {
  name: 'SucceedToPay',
  components: { BaseButton },
  // data() {
  //   return {};
  // },
  methods: {
    // turn() {
    //   this.$router.go(-1);
    // },
    complete() {
      console.log('href'); // 无则直接跳转首页
      const returnUrl = sessionStorage.getItem('returnUrl');
      if (returnUrl) {
        location.href = returnUrl;
      } else {
        console.log('fail to find returnUrl');
        history.go(-3);
      }
    }
  },
  created() {
    try {
      //确认由付款页跳转而来
      if (sessionStorage.getItem('status') * 1 !== 200) {
        throw 'not equal 200';
      }
    } catch (err) {
      //this.$root.$emit('showModal', { type: 'toast', conf: { text: '请稍后重试', } });
      sessionStorage.removeItem('status');
      this.complete(); // 回跳
      // this.$router.replace('/');
      return;
    }
    sessionStorage.removeItem('status');
    // this.$clearComponent('bills');
  },
};

</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
}

.top {
  height: 2rem;
  background: url(~@/assets/images/repay/tick.svg)center .3rem/.7rem auto no-repeat, #fff;
  text-align: center;
}

.submit-suc {
  color: #212121;
  font-size: .18rem;
  padding-top: 1.2rem;
}

.evaluate {
  color: #757575;
  font-size: .14rem;
  margin-top: 0.08rem;
}

</style>
