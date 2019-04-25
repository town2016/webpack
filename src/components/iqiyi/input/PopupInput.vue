<!-- 输入框点选组件 -->
<template>
  <div class="inputContainer">
    <!-- 输入框左边的icon -->
    <img
      v-if="leftIcon"
      :src="leftIcon"
      class="leftIcon"
    />
    <!-- 输入框左边的文字 -->
    <label v-if="label">{{label}}</label>
    <!-- 输入框，父组件需要监听'input'或者'change'事件，拿到输入框的值 -->
    <input
      class="input"
      :value="currentValue"
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
    <!-- 输入框右边的icon -->
    <img
      v-if="rightPic"
      :src="rightPic"
      class="rightPic"
      @click="$emit('btnClick')"
    />
    <!-- 右箭头按键 -->
 <!--    <button
      class="rightBtn"
      @click="$emit('btnClick')"
      :disabled="btnDisabled"
      :class="{'btn-arrow-disabled': btnArrowDisabled}"
    ></button> -->
  </div>
</template>

<script>
  export default {
    name: 'PopupInput',
    /* 类型检查 */
    props: {
      leftIcon: {             // 输入框左边的icon
        type: String,
      },
      rightPic: {             // 输入框左边的icon
        type: String,
      },
      label: String,         // 输入框左边的文字
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
    },
    data() {
      return {
        btnDisabled: false,
        currentValue: this.value,   // 将props中value的值作为输入框的初始值
      }
    },
    methods: {
      handleInput(event) {
        this.currentValue = event.target.value;
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
  .leftIcon {
    width: 0.1rem;
    height: 0.15rem;
    margin: 0 10px;
  }
  .rightPic {
    width: 0.075rem;
    height:0.14rem;
  }
  .rightBtn {
    border: none;
    background: none;
    width: 0.075rem;
    height:0.14rem;
    background-size: 0.08rem 0.14rem;
  }
  label {
    font-size:0.15rem;
    color:#212121;
  }
  .input {
    flex: 1;
    width: 1rem;
    padding: 6px 5px;
    background-color: transparent;
    border: none;
    outline: none;
    text-align: right;
  }

</style>
