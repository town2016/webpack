<template>
  <div class="wrap-box bg-white" :class='{"box__childs--border":bottomBorder}'>
    <span class="input--required" v-if='required'>*</span>
    <span class="wrap-box__desc" :style="{width:descWidth}">{{desc}}</span>
    <div class="wrap-box__slot" v-if='useSlot'>
      <slot name='tail'></slot>
    </div>
    <input v-else class="wrap-box__input" type="text" ref='input' v-on:input='change' :placeholder='placeholder' v-model='value'>
  </div>
</template>
<script>
import inputMixin from './mixin/inputMixin';
// 基于reset.css
//import '@/assets/css/reset.css';
export default {
  name: "KeyValueInputFill",
  mixins: [inputMixin],
  data() {
    return {
      inputRequired: false,
      descWidth: "auto",
      value: ""
    };
  },
  props: {
    token: {
      default: null
    },
    desc: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: "请输入...",
    },
    // type: {
    //   type: String,
    //   default: "input",
    // },
    bottomBorder: {
      type: Boolean,
      default: true,
    },
    inputValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: [String, Boolean],
      default: 'none',
    },
    leftWidth: {
      type: String,
      default: 'auto',
    },
    required: {
      type: Boolean,
      default: false,
    },
    useSlot: {
      type: Boolean,
      default: false,
    }
  },
  created() {
    const leftWidth = Number(this.leftWidth.replace(/[A-Za-z]+/, ''));
    if (leftWidth) {
      this.descWidth = `${leftWidth}rem`;
    }
  },
};
</script>
<style lang="scss" scoped>
.wrap-box {
  position: relative;
  overflow: hidden;
  height: 0.45rem;
  line-height: 0.45rem;
  padding: 0 0.15rem;
  font-size: 0.14rem;
  display: flex;
  flex-flow: row nowrap;
}

.wrap-box__desc {
  padding-right: 0.15rem;
  color: #212121;
}

.wrap-box__input {
  border: none;
  background-color: transparent;
  color: #666;
  flex: 1;
}

.wrap-box__slot {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.input--required {
  color: rgb(243, 63, 61);
  position: absolute;
  left: 0.07rem;
  top: 0;
}

.box__childs--border {

  .wrap-box__input,
  .wrap-box__slot,
  .wrap-box__desc {
    border-bottom: 1px solid #eeeeee;
  }
}

.wrap-box__input::-webkit-input-placeholder {
  color: #C1C1C1;
}
</style>