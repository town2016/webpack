<template>
  <div class="wrap">
    <SuccessPageIntro :text='{firstStep:"还款提交成功",secondStep:"预计还款划扣时间需要30分钟"}'></SuccessPageIntro>
    <!-- <BaseButton text='继续划扣' @click.native='turn' type='blue' mt='.15rem'></BaseButton> -->
    <BaseButton text='完成' @click.native='complete' type='yellow' mt='.4rem'></BaseButton>
  </div>
</template>
<script>
import BaseButton from '@/components/h5process/base/BaseButton';
import SuccessPageIntro from '@/components/h5process/repayment/SuccessPageIntro';
import { mapGetters } from 'vuex';

export default {
  name: 'succeedToPay',
  components: { BaseButton, SuccessPageIntro },
  computed: {
    ...mapGetters('Reference', ['baseOriginInfo']),
    fromUrl() {
      return this.baseOriginInfo.fromUrl;
    }
  },
  methods: {
    // turn() {
    //   this.$router.go(-1);
    // },
    complete() {
      if (this.fromUrl) {
        window.location.href = this.fromUrl;
        return;
      }
      const returnUrl = sessionStorage.getItem('routerPath');
      if (returnUrl) {
        sessionStorage.removeItem('routerPath');
        this.$router.replace(returnUrl);
      } else {
        console.log('fail to find returnUrl');
        history.go(-1);
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
      // this.$store.dispatch('showToast', { text: '流程出错' });
      sessionStorage.removeItem('status');
      this.complete(); // 回跳
      return;
    }
    sessionStorage.removeItem('status');
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  background-color: #fff;
  padding-top: .3rem;
}
</style>
