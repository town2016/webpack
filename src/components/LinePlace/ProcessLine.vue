<template>
  <div class="process-warpper" :class="[type]">
    <div class="icon-area">
      <div v-if='type==="end" || type==="both"' class="boundary-line top" :style='{backgroundColor:lineColor}'></div>
      <slot name='icon'></slot>
      <div v-if='type==="start" || type==="both"' class="boundary-line tail" :style='{backgroundColor:lineColor}'></div>
    </div>
    <div class="text-icon" v-if="text">{{text}}</div>
    <div class="text-icon" v-else>
      <slot name='text'></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProcessLine',
  props: {
    type: {
      default: 'none',
      validator(value) {
        return ['none', 'start', 'end', 'both'].indexOf(value) !== -1
      }
    },
    selected: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: ''
    },
    themeColor: {
      type: String,
      default: '#FED149'
    }
  },
  computed: {
    lineColor() {
      return this.selected ? this.themeColor : '#D8D8D8';
    }
  }
}
</script>

<style lang='scss' scoped>
.process-warpper {
  // height: .4rem;
  line-height: .4rem;
  padding: 0 .15rem;
  font-size: .16rem;
  color: #212121;
  overflow: hidden;

  &.start {
    padding-bottom: .25rem;
  }

  &.end {
    padding-top: .25rem;
  }

  &.both {
    padding: .25rem 0;
  }
}

.icon-area {
  height: .4rem;
  width: .4rem;
  position: relative;
  float: left;
}

.text-icon {
  float: left;
  padding-left: .15rem;
}

.boundary-line {
  position: absolute;
  width: .02rem;
  height: .25rem;
  left: 50%;
  margin-left: -.01rem;

  &.top {
    top: -.25rem;
  }

  &.tail {
    bottom: -.25rem;
  }
}
</style>