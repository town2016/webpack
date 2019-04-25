<template>
  <div class="wrap-box bg-white" :class='{"box__childs--border":bottomBorder}'>
    <span class="input--required" v-if='required'>*</span>
    <span class="wrap-box__desc" :style="{width:descWidth}">{{desc}}</span>
    <div class="wrap-box__slot" v-if='useSlot'>
      <slot name='tail'></slot>
    </div>
    <input class="wrap-box__input" v-else v-bind="$attrs" :value="value" v-on:input="$emit('input', $event.target.value)" type="text" ref='input'>
  </div>
</template>
<script>
//import inputMixin from './mixin/inputMixin';
// 基于reset.css
//import '@/assets/css/reset.css';
export default {
  name: "KeyValueInputFill",
  inheritAttrs: false,
  // 自定义v-model指令 -> 默认使用的是v-on:input 和 :value两者结合
  //  e.g. event:'change' 可以自定义使用v-on:change
  model: {
    prop: 'value', 
    event: 'input' 
  },
  data() {
    return {
      descWidth: "auto",
    };
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      required: true
    },
    bottomBorder: {
      type: Boolean,
      default: true,
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
    },
    // 输入框的文字颜色
    inputColor: {
      type: String,
      default: '',
    }
  },
  watch: {
    disabled(newVal) {
      this.switchDisabledState(newVal);
    }
  },
  created() {
    const leftWidth = Number(this.leftWidth.replace(/[A-Za-z]+/, ''));
    if (leftWidth) {
      this.descWidth = `${leftWidth}rem`;
    }
  },
  mounted() {
    // input Color
    const inputColor = this.inputColor;
    const curInput = this.$refs.input;
    if (inputColor && curInput) {
      curInput.setAttribute('style', `color:${inputColor}`);
    }
    // disabled
    this.switchDisabledState = (newVal) => {
      if (this.useSlot) {
        return;
      }
      if (newVal === 'disabled' || newVal === true || newVal === 1) {
        this.$refs.input.disabled = true;
      } else {
        this.$refs.input.disabled = false;
      }
    };
    this.switchDisabledState(this.disabled);
  }
};
</script>
<style lang="scss" scoped>
.wrap-box {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 0.45rem;
  line-height: 0.45rem;
  padding: 0 0.15rem;
  font-size: 0.16rem;
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