<template>
  <div class="check-code" :class='{disabled:!codeSwitch}' @click='sendCode'><span>{{text}}</span></div>
</template>
<script>
export default {
  name: 'CheckCode',
  data() {
    return {
      text: '获取验证码',
      codeSwitch: true,
    }
  },
  methods: {
    sendCode() {
      if (!this.codeSwitch) {
        return;
      }
      this.$emit('sendCode', () => {
        let countdown = 60;
        this.codeSwitch = false;
        this.text = `获取(${countdown})`; // 倒计时的秒数
        this.setTimer = () => {
          // 状态改变
          this.timer = setTimeout(() => {
            countdown--;
            if (!countdown) { // restore
              this.codeSwitch = true;
              this.text = '获取验证码';
              //clearTimeout(this.timer);
              return;
            }
            if (countdown < 10) {
              countdown = '0' + countdown;
            }
            this.text = `获取(${countdown})`;
            this.setTimer();
          }, 1000);
        };
        this.setTimer();
      });
    }
  },
  created() {
    this.timer = null;
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
}
</script>
<style lang="scss" scoped>
.check-code {
  position: absolute;
  width: 0.8rem;
  height: 0.24rem;
  line-height: 0.24rem;
  right: 0.15rem;
  top: 0.11rem;
  border: 1px solid #ffca00;
  color: #ffca00;
  text-align: center;
  font-size: .12rem;
  border-radius: 0.12rem;

  &.disabled {
    background-color: transparent;
    border-color: #999 !important;
    color: #999 !important;
  }
}
</style>