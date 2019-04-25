<template>
  <div v-if="text.length" class="top-tip" :class='[type]'>{{text}}</div>
</template>
<script>

export default {
  name: 'TopTip',
  props: {
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info'
    }
  }
};

</script>
<style lang="scss" scoped>
  .top-tip{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.3rem;
    line-height: 0.3rem;
    font-size: 0.13rem;
    font-family:PingFangSC-Regular;
    font-weight:400;
    padding: 0 15px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    text-align: center;
    z-index: 100;
    &.info{
      color: #909399;
      background-color: #edf2fc;
    }
    &.warning{
      color: #E6A23C;
      background-color: #fdf6ec;
    }
    &.success{
      color: #67C23A;
      background-color: #f0f9eb;
    }
    &.error{
      color: #F33F3D;
      background-color: #FFE8E8;
    }
  }
</style>
