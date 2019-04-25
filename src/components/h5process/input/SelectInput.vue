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
    <label v-if="label" class="leftLabel">{{label}}</label>
    <div class="select-content">
      <p v-if="value" class="select-value">{{value}}</p>
      <p v-else class="select-placeholder">{{placeholder}}</p>
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
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 0.45rem;
    background-color: #fff;
  }
  .leftLabel {
    margin-left: 0.15rem;
    font-size: 0.15rem;
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
    color: rgb(33,33,33);
  }
  .select-placeholder {
    padding-right: 0.1rem;
    font-size: 0.15rem;
    color: rgb(193,193,193);
  }

</style>
