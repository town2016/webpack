<!-- 短信验证码输入框 -->
<template>
  <div class="inputContainer">
    <!-- 输入框左边的icon -->
    <img
      v-if="leftIcon"
      :src="leftIcon"
      class="leftIcon"
    />
    <!-- 输入框左边的文字 -->
    <label v-if="label" class="leftLabel">{{label}}</label>
    <!-- 输入框，父组件需要监听'input'或者'change'事件，拿到输入框的值 -->
    <input
      class="input"
      :value="currentValue"
      @input="handleInput"
      @change="$emit('change', currentValue)"
      @focus="$emit('focus', currentValue)"
      @blur="$emit('blur', currentValue)"
      :type="type"
      :disabled="disabled"
      :readonly="readonly"
      :minlength="minlength"
      :maxlength="maxlength"
      :min="min"
      :max="max"
      :placeholder="placeholder"
    />
    <!-- 输入框右边的获取短信验证码按钮，倒计时，重新获取按钮 -->
    <button
      class="btn-sms-code"
      :class="{'btn-sms-code-disabled': disabled || btnSmsCodeDisabled}"
      :disabled="btnSmsCodeDisabled"
      @click="$emit('btnClick')"
    >
      {{btnText}}
    </button>
  </div>
</template>

<script>
  export default {
    name: 'SmsCodeInput',
    /* 类型检查 */
    props: {
      leftIcon: {             // 输入框左边的icon
        type: String,
      },
      label: String,          // 输入框左边的文字
      value: {                // 输入框的值
        type: null,
        default: '',
      },
      type: {                 // 输入框的类型
        type: String,
      },
      disabled: {             // 不可用
        type: Boolean,
        default: false,
      },
      readonly: {             // 只读
        type: Boolean,
        default: false,
      },
      minlength: Number,      // 最小长度
      maxlength: Number,      // 最大长度
      min: Number,            // 最小值
      max: Number,            // 最大值
      placeholder: {          // 输入框placeholder文字
        type: String,
        default: '',
      },
      totalTime: {            // 短信验证码倒计时时长
        type: Number,
        default: 60,
      },
    },
    data() {
      return {
        btnText: '获取验证码',        // 获取短信验证码按钮中的文字
        btnSmsCodeDisabled: false,  // 获取短信验证码按钮是否可点击
        time: this.totalTime,       // 短信验证码倒计时时长
        currentValue: this.value,   // 将props中value的值作为输入框的初始值
        timer: null, // 定时器id
      }
    },
    methods: {
      handleInput(event) {
        this.currentValue = event.target.value;
      },
      startCountDown() {                  // 开始倒计时
        if (this.timer) return;
        this.timer = setInterval(() => {
          this.btnText = this.time + 's'; // 设置按钮的文字为剩余秒数
          this.btnSmsCodeDisabled = true; // 倒计时过程中，按钮设置为不可点击

          if(this.time < 0) {
            this.stopCount();            // 倒计时结束时清除定时器，恢复倒计时时长为总时长，按钮恢复为可点击
            // clearInterval(this.timer);
            // this.time = this.totalTime;
            // this.btnSmsCodeDisabled = false;
            // this.btnText = '重新获取';
            // this.timer = null; // 清除定时器id
          } else {
            this.time--;                  // 时间递减
          }
        }, 1000);
      },
      stopCount() { // 停止倒计时
        clearInterval(this.timer);
        this.time = this.totalTime;
        this.btnSmsCodeDisabled = false;
        this.btnText = '重新获取';
        this.timer = null;
      },
      reset() {
        this.currentValue = '';
      },
    },
    watch: {
      value(val) {
        this.currentValue = val;
      },
      currentValue(val) {
        this.$emit('input', val);
      },
    },
  }
</script>

<style scoped>
  .inputContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 0.45rem;
    background-color: #fff;
  }
  .leftLabel {
    width: 37%;
    margin-left: 0.15rem;
    font-size: 15px;
    /*color: rgb(33,33,33);*/
    color: #000000;
  }
  .leftIcon {
    width: 0.15rem;
    height: 0.2rem;
    margin-left: 0.15rem;
  }
  .input {
    /* flex: 1; */
    width: 100%;
    padding: 6px 5px 6px 0.15rem;
    font-size: 15px;
    background-color: transparent;
    border: none;
    outline: none;
    display:block;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .input::-webkit-input-placeholder {
    color: rgb(193,193,193);
  }
  .btn-sms-code {
    /* width:1rem; */
    width: 50%;
    margin-right: 0.15rem;
    padding: 4px 8px;
    font-size: 12px;
    /*color: #278cde;*/
    background-color: #fff;
    border-radius: 0.2rem;
    /*border: 1px solid #278cde;*/
    color: #398efd;;
    border: 1px solid #398efd;
  }
  .btn-sms-code-disabled {
    border-color: #c7c7c7;
    color: grey;
    pointer-events: none;
  }
  /*.btn-sms-code-disabled .btn-sms-code {
    border-color: #c7c7c7;
    color: grey;
  }*/

</style>
