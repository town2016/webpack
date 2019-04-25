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
    position: fixed;
    width: 100%;
    height: 30px;
    left: 0;
    top: 0;
    text-align: center;
    line-height: 30px;
    font-size: 13px;
    color: rgb(253,115,76);
    background-color: rgb(245,228,223);
  }
</style>


