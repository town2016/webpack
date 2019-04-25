<template>
  <div class="line-wrapper" :class="{'line--arrow':arrow}">
    <div class="line-desc" :style="{width:descWidth}">{{desc}}</div>
    <div class="line-value" v-if='value'>{{value}}</div>
    <div class="line-value" v-else>
      <slot name='value'></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrimaryLine',
  props: {
    desc: {
      type: String,
      required: true
    },
    descWidth: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    arrow: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang='scss' scoped>
@import "@/assets/styles/core/_core.scss";

.line-wrapper {
  height: .45rem;
  line-height: .45rem;
  font-size: .15rem;
  color: #212121;
  padding: 0 .15rem;
  border-bottom: 1px solid #f3f3f3;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  background-color: #fff;

  &.line--arrow {
    padding-right: .35rem;
    @include bg-image('./icon/arrow', (right .15rem center/.18rem auto no-repeat, #fff));
  }
}

.line-desc {
  width: .82rem;
  height: 100%;
  padding-right: .18rem;
}

.line-value {
  overflow: hidden;
  flex: 1;
}
</style>