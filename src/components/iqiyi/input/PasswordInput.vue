<!-- 密码输入框组件 -->
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
      v-model="currentValue"
      @input="handleInput"
      @change="$emit('change', currentValue)"
      :type="type"
      :disabled="disabled"
      :readonly="readonly"
      :minlength="minlength"
      :maxlength="maxlength"
      :min="min"
      :max="max"
      :placeholder="placeholder"
    />
    <!-- 输入框右边的显示或隐藏密码icon -->
    <img
      v-if="rightIconInvisible"
      :src="rightIcon"
      @click="toggleShow"
      class="rightIcon"
    />
  </div>
</template>

<script>
  export default {
    name: 'PasswordInput',
    /* 类型检查 */
    props: {
      leftIcon: {             // 输入框左边的icon
        type: String,
      },
      rightIconInvisible: {   // 输入框右边隐藏密码的icon
        type: String,
      },
      rightIconVisible: {     // 输入框右边显示密码的icon
        type: String,
      },
      label: String,          // 输入框左边的文字
      value: {                // 输入框的值
        type: null,
        default: '',
      },
      inputType: {                 // 输入框的类型
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
      ruleReg: { // 如果密码需要去除敏感字符时候的去除规则
        type: null,
      },
    },
    data() {
      return {
        rightIcon: this.rightIconVisible,
        currentValue: this.value,   // 将props中value的值作为输入框的初始值
        type: this.inputType,
      };
    },
    methods: {
      handleInput(event) {
        console.log(this.ruleReg);
        if (this.ruleReg) {
          console.log('====');
          this.currentValue = event.target.value.replace(this.ruleReg, '');
          console.log(this.currentValue);
        } else {
          this.currentValue = event.target.value;
        }
      },
      toggleShow() {                // 显示或隐藏密码
        this.type = this.type === 'password' ? 'text' : 'password';
        this.rightIcon = this.rightIcon === this.rightIconVisible ? this.rightIconInvisible : this.rightIconVisible;
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
  };
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
    margin-left: 0.15rem;
    font-size: 15px;
    /*color: rgb(117,117,117);*/
    /*color: rgb(33,33,33);*/
    color: #000000;
  }
  .leftIcon {
    width: 0.15rem;
    height: 0.2rem;
    margin-left: 0.15rem;
  }
  .rightIcon {
    width: 0.2rem;
    height: 0.2rem;
    padding: 0 0.15rem;
  }
  .input {
    flex: 1;
    padding: 6px 5px 6px 0.15rem;
    font-size: 15px;
    background-color: transparent;
    border: none;
    outline: none;
  }
  .input::-webkit-input-placeholder {
    color: rgb(193,193,193);
  }

</style>
