<template>
  <div class="register-sms-field">
    <input
      type="tel"
      class="register-input register-input-left fz-px-15"
      maxlength="6"
      :value="value"
      @input="inputChange"
      @focus="inputFocus"
      placeholder="请输入短信验证码" />
    <input
      type="button"
      ref="smsBtn"
      class="register-input-right fz-px-13"
      :class="{'disabled': disabledBtn}"
      :value="btnText"
      @click="getSmsCode" />
  </div>
</template>

<script>
  export default {
    name: 'RegisterSmsCode',
    props: {
      value: {
        type: String,
        default: ''
      },
      timeTotal: {
        type: Number,
        default: 60
      }
    },
    data() {
      return {
        time: this.timeTotal,
        timer: null, // 定时器
        disabledBtn: false,
        btnText: '获取验证码'
      }
    },
    methods: {
      inputFocus(e) {
        // 兼容安卓输入框弹出后无法看到文本框
        if (browserTouna.versions.android) {
          this.$nextTick(() => {
            var root = document.getElementById('appRootDiv')
            setTimeout(() => {
              root.scrollTop = 0;
              root.scrollTop = root.scrollTop + 200;
            },400)
          })
        }
      },
      inputChange($event) {
        this.$emit('input', $event.target.value)
      },
      getSmsCode() {
        if(this.timer) return;
        this.$emit('getSmsCodeHandler', () => {
          this.disabledBtn = true;
          this.btnText = `${this.time}s`;
          this.timer = setInterval(() => {
            --this.time;
            if(this.time >= 0) {
              this.btnText = `${this.time}s`;
              return;
            }
            this.resetCountdown();
          }, 1000);
        });
      },
      resetCountdown() {
        clearInterval(this.timer);
        this.time = this.timeTotal;
        this.disabledBtn = false;
        this.btnText = '重新获取';
        this.timer = null;
      }
    },
  }
</script>

<style lang="scss" scoped>
  .register-sms-field {
    display: flex;
    font-size: .14rem;
  }
  .register-input {
    padding: 0 0.22rem;
    width: 100%;
    border-radius: 999px;
    background-color: #FFF2E1;
    border: none;
  }
  .register-input::-webkit-input-placeholder {
    color: #D2A167;
  }
  .register-input-left {
    font-size: .14rem;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .register-input-right {
    font-size: .14rem;
    flex-shrink: 0;
    width: 0.98rem;
    height: 0.45rem;
    border: none;
    border-radius: 0;
    border-top-right-radius: 0.23rem;
    border-bottom-right-radius: 0.23rem;
    background-color: #FF9210;
    color: #fff;
  }
  .register-input-right.disabled {
    background-color: #c1c1c1;
    pointer-events: none;
  }
</style>
