<template>
  <div class="list-state">
    <div class='icon' :class='type'></div>
    <div class="description">{{text}}</div>
    <slot v-if='type==="fail"'></slot>
  </div>
</template>
<script>
export default {
  name: 'ListState',
  props: {
    type: {
      default: 'empty',
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['empty', 'loading', 'fail'].indexOf(value) !== -1
      }
    },
    textConf: {
      type: Object,
      default: () => {},
    },
    emptyDesc: {
      type:String
    }
    // except: {
    //   type: Array,
    // }
  },
  computed: {
    text() {
      return this.defaultText[this.type];
    },
  },
  created() {
    this.defaultText = Object.assign({
      empty: this.emptyDesc || '赞！当前账单已还清～',
      loading: 'Loading...',
      fail: '加载失败～～',
    }, this.textConf);
  },
};
</script>
<style lang="scss" scoped>
.list-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -80%); // z-index: 9;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  &.empty {
    background-image: url('~@/assets/images/repay/empty.svg');
  }

  &.fail {
    background-image: url('~@/assets/images/repay/error.png');
  }

  &.loading {
    background-size: 52% auto;
    background-image: url('~@/assets/images/common/spin.gif');
  }
}

.description {
  font-size: .15rem;
  color: #666;
  text-align: center; // margin-top: 0.1rem;
}
</style>