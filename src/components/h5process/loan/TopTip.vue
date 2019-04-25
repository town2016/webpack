<template>
  <div class="tips">
    {{ text }}
  </div>
</template>

<script>
  export default {
    name: 'topTips',
    /* 类型检查 */
    props: {
      text: {             // 提示文字
        type: String,
        default: '',
      },
    },
  };
</script>

<style scoped>
  .tips {
    position: absolute;
    width: 100%;
    height: 95px;
    left: 0;
    top: 0;
    text-align: center;
    font-size: 14px;
    background-color: rgb(255,247,220);
    z-index: 1;
    font-weight:500;
    color:rgba(33,33,33,1);
    line-height:50px;
  }
</style>


