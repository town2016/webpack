<!-- 输入框组件 -->
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
      @focus="inputFocus"
      @blur="inputBlur"
      :type="type"
      :disabled="disabled"
      :readonly="readonly"
      :minlength="minlength"
      :maxlength="maxlength"
      :min="min"
      :max="max"
      :placeholder="placeholder"
    />
    <!-- 输入框右边的icon -->
    <img
      v-if="rightIcon"
      :src="rightIcon"
      @click="$emit('rightIconClick')"
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
      rightIcon: {            // 输入框右边的icon
        type: String,
      },
      label: String,          // 输入框左边的文字
      value: {                // 输入框的值
        type: null,
        default: ''
      },
      type: {                 // 输入框的类型
        type: String
      },
      disabled: {             // 不可用
        type: Boolean,
        default: false
      },
      readonly: {             // 只读
        type: Boolean,
        default: false
      },
      minlength: Number,      // 最小长度
      maxlength: Number,      // 最大长度
      min: Number,            // 最小值
      max: Number,            // 最大值
      placeholder: {          // 输入框placeholder文字
        type: String,
        default: ''
      },
    },
    data() {
      return {
        currentValue: this.value // 将props中value的值作为输入框的初始值
      };
    },
    methods: {
      handleInput(event) {
        this.currentValue = event.target.value;
      },
      inputFocus(e) {
        if (browserTouna.versions.android) {
          this.$nextTick(() => {
            var root = document.getElementById('appRootDiv')
            setTimeout(() => {
              root.scrollTop = 0;
              root.scrollTop = root.scrollTop + 200;
            },400)
            // e.target.scrollIntoView(true);
          },300);
        }
      },
      inputBlur(e){
        this.$emit('blur', this.currentValue);
      }
    },
    watch: {
      value(val) {
        this.currentValue = val;
      },
      currentValue(val) {
        this.$emit('input', val);
      }
    }
  };
</script>

<style scoped>
  .inputContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 0.45rem;
    -webkit-border-radius: 0.23rem;
    -moz-border-radius: 0.23rem;
    border-radius: 0.23rem;
    background-color: #FFF2E1;
  }
  .leftLabel {
    margin-left: 0.15rem;
     font-size: .14rem;
    color: #000000;
  }
  .leftIcon {
    width: 0.15rem;
    height: 0.2rem;
    margin-left: 0.15rem;
  }
  .rightIcon {
    width: 0.22rem;
    height: 0.2rem;
    margin: 0 0.15rem;
  }
  .input {
    flex: 1;
    padding: 6px 5px 6px 0.22rem;
    font-size: .14rem;
    background-color: transparent;
    border: none;
    outline: none;
    display:block;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    color: #212121;
  }
  .input::-webkit-input-placeholder {
    color: #D2A167;
  }

</style>
