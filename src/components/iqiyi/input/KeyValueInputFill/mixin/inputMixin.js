export default {
  methods: {
    change(v) {
      const el = v.target;
      this.$emit('oninput', {
        value: el.value,
        token: this.token
      }); // 可以监听值得变化
    }
  },
  created() {
    if (this.inputValue) { // 赋默认值
      this.value = this.inputValue;
    }
  },
  mounted() {
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
  },
  watch: {
    inputValue(newVal) { // 值发生改变自动同步
      this.value = newVal;
      this.$emit('oninput', {
        value: newVal,
        token: this.token
      });
    },
    disabled(newVal) {
      this.switchDisabledState(newVal);
    }
  }
  // mounted() {
  //   // this.target = this.$refs.input;
  //   Reflect.defineProperty(this, 'value', {
  //     get() {
  //       return this.textContent;
  //       // const mInput = this.target;
  //       // if (mInput) {
  //       //   return mInput.value;
  //       // }
  //       // return null;
  //     },
  //     set(v) {
  //       this.textContent = v;
  //       // const mInput = this.target;
  //       // if (mInput) {
  //       //   mInput.value = v;
  //       // }
  //     },
  //     configurable: false,
  //     enumerable: false,
  //   });
  // },
};