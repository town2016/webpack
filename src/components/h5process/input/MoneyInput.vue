<!-- 借款金额输入框组件 -->
<template>
  <div class="content">
    <p class="title">{{title}}</p>
    <div class="inputContainer">
      <!-- 输入框左边的文字 -->
      <label class="leftLabel">￥</label>
      <!-- 输入框，父组件需要监听'input'或者'change'事件，拿到输入框的值 -->
      <input id="inputFocus" class="input" :value="currentValue" @input="handleInput" @change="$emit('change', currentValue)"
             @blur="$emit('blur', currentValue)" :type="type" :disabled="disabled" :readonly="readonly"
             :minlength="minlength" :maxlength="maxlength" :min="min" :max="max" :placeholder="placeholder" />
      <div v-if='isOver' class='close' @click='clear'></div>
    </div>
    <div class="desc-text">
      <p class="is-over" v-if='isOver'>超过借款金额</p>
      <slot v-else name="desc"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordInput',
  /* 类型检查 */
  props: {
    title: { // 标题
      type: String,
      default: '借多少钱',
    },
    value: { // 输入框的值
      type: null,
      default: '',
    },
    type: { // 输入框的类型
      type: String,
    },
    disabled: { // 不可用
      type: Boolean,
      default: false,
    },
    readonly: { // 只读
      type: Boolean,
      default: false,
    },
    moneyCan: {
      required: true
    },
    minlength: Number, // 最小长度
    maxlength: Number, // 最大长度
    min: Number, // 最小值
    max: Number, // 最大值
    placeholder: { // 输入框placeholder文字
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentValue: this.value, // 将props中value的值作为输入框的初始值
    };
  },
  computed: {
    maxMoney() {
      return isNaN(this.moneyCan) ? 999999 : this.moneyCan
    },
    isOver() {
      return this.value > this.maxMoney;
    }
  },
  methods: {
    handleInput(event) {
      this.currentValue = event.target.value;
    },
    clear() {
      this.currentValue = '';
    }
  },
  watch: {
    value(val) {
      this.currentValue = val.toString().replace(/^(0+)|[^\d]+/g, '');
    },
    currentValue(val) {
      this.$emit('input', val);
    },
  },
};
</script>

<style scoped>
/* assets\images\input */
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.12rem 0 0.08rem;
  background-color: #fff;
}

.title {
  padding-left: 0.15rem;
  font-size: 15px;
  font-weight: bold;
  color: #000000;
}

.close {
  position: absolute;
  right: 0.15rem;
  top: .25rem;
  width: .18rem;
  height: .18rem;
  background: url('~@/assets/images/input/clear.png')center/100% auto no-repeat;
}

.inputContainer {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  position: relative;
  height: 0.6rem;
  padding-bottom: 0.08rem;
  background-color: #fff;
  border-bottom: 1px solid #ededed;
  margin-bottom: .1rem;
}

.leftLabel {
  margin-left: 0.15rem;
  font-size: 15px;
  color: rgb(117, 117, 117);
}

.input {
  flex: 1;
  padding: 6px 5px 0px 8px;
  font-size: 32px;
  font-family: 'DIN';
  font-weight: 300;
  background-color: transparent;
  border: none;
  outline: none;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.input::-webkit-input-placeholder {
  color: rgb(193, 193, 193);
}

.desc-text {
  padding-left: 0.15rem;
}

.is-over {
  color: #F33F3D;
  font-size: .12rem;
}
</style>