<!--等待动画-->
<template>
  <mt-popup
    v-model="popupVisible"
    position="middle"
    :closeOnClickModal="false"
    id="messageBox">
    <div class="message-content">
      <p v-if="showTitle" class="title">{{ titleText }}</p>
      <p v-if="!!content" class="content" :class="{ onlyContent: !showTitle }" v-html="content"></p>
      <div class="btn-confirm" @click="popupVisible=false">确定</div>
    </div>
  </mt-popup>
</template>

<script>
  export default {
    name: 'waitMoment',
    props: {
      visible: { // 是否显示等待界面
        type: Boolean,
        default: false,
      },
      titleText: { // 显示的提示标题
        type: String,
        default: '提示',
      },
      content: { // 显示的提示内容
        type: String,
      },
      showTitle: { // 是否显示提示标题
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        popupVisible: this.visible, // 是否显示popup
      };
    },
    watch: {
      visible(newValue) {
        this.popupVisible = newValue;
      },
      popupVisible(newValue) {
        this.$emit('update:visible', newValue);
      }
    }
  };
</script>

<style scoped lang="scss">
#messageBox{
  background: transparent;
  width: 2.7rem;
  color: #212121;
  .message-content{
    border-radius: 0.05rem;
    background-color: #fff;
    text-align: center;
    .title{
      line-height: 1;
      font-size: 0.18rem;
      text-align: center;
      padding: 0.15rem 0;
    }
    .content{
      padding: 0 0.23rem 0.27rem;
      line-height: 0.19rem;
      font-size: 0.14rem;
      &.onlyContent{
        padding: 0.27rem 0.23rem;
      }
    }
    .btn-confirm{
      height: 0.44rem;
      line-height: 0.44rem;
      font-size: 0.16rem;
      border-top: 1px solid #DBDBDB;
      border-radius: 0 0 0.05rem 0.05rem;
      &:active{
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
