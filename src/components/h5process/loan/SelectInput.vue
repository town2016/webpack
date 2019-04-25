<!-- 选择输入框组件 -->
<template>
  <div class="selectContainer">
    <!-- 输入框左边的icon -->
    <img
      v-if="leftIcon"
      :src="leftIcon"
      class="leftIcon"
    />
    <!-- 输入框左边的文字 -->
    <label
      v-if="label"
      class="leftLabel"
    >{{label}}</label>
    <div class="select-content">
      <!-- <img
        v-if="valueImg"
        class="value-img"
        :src="valueImg"
        alt=""
      > -->
      <bank-logo
        v-if="valueImg"
        width=".3rem"
        height=".3rem"
        :according="valueImg || ''"
      ></bank-logo>
      <p
        v-if="value"
        class="select-value"
        :class='{hasimg:valueImg}'
      >{{value}}</p>
      <p
        v-else
        class="select-placeholder"
        :class='{hasimg:valueImg}'
      >{{placeholder}}</p>
    </div>
    <!-- 输入框右边的icon -->
    <img
      v-show="showRightIcon"
      :src="rightIcon"
      class="rightIcon"
    />
  </div>
</template>

<script>
import RightArrow from '@/assets/images/input/right_arrow.png';
import BankLogo from '@/components/BankLogo/index';
export default {
  name: 'SelectInput',
  /* 类型检查 */
  props: {
    leftIcon: {             // 输入框左边的icon
      type: String,
    },
    rightIcon: {            // 输入框右边的icon
      type: String,
      default: RightArrow,
    },
    valueImg: {            // 值左边的图片
      type: String,
    },
    label: String,          // 输入框左边的文字
    value: {                // 输入框的值
      type: null,
      default: '',
    },
    placeholder: {          // 输入框placeholder文字
      type: String,
      default: '',
    },
    showRightIcon: {             // 是否新手右侧图标
      type: Boolean,
      default: true,
    }
  },
  components: {
    BankLogo,
  },
  data() {
    return {
      currentValue: this.value,   // 将props中value的值作为输入框的初始值
    };
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
};
</script>

<style scoped>
.selectContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 0.45rem;
  background-color: #fff;
  /* width: 2.3rem; */
}
.leftLabel {
  margin-left: 0.15rem;
  font-size: 15px;
  color: #000000;
}
.leftIcon {
  width: 0.15rem;
  height: 0.2rem;
  margin-left: 0.15rem;
}
.rightIcon {
  width: 0.15rem;
  height: 0.2rem;
  margin-right: 0.1rem;
}
.select-content {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
}
.select-value {
  padding-right: 0.1rem;
  font-size: 0.15rem;
  color: rgb(33, 33, 33);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 2.05rem;
}
.select-placeholder {
  padding-right: 0.1rem;
  font-size: 0.15rem;
  color: rgb(193, 193, 193);
  width: 2.05rem;
}
.value-img {
  width: 0.2rem;
  height: 0.2rem;
  margin-right: 0.1rem;
}
.hasimg {
  width: 2.06rem !important;
}
</style>
