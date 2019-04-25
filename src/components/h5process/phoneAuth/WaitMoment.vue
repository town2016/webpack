<!--等待动画-->
<template>
  <mt-popup
    v-model="popupVisible"
    position="middle"
    :closeOnClickModal="false"
    id="waitMoment">
    <i v-if="closeBtn" class="mint-toast-icon mintui mintui-field-error close-icon" @click="popupVisible=false"></i>
    <div class="waitMomentWrap">
      <div class="pic">
        <img src="/static/wait.gif" alt="" style="width: 100%;">
      </div>
      <p v-if="showTitle" class="wait">{{ titleText }}</p>
      <p v-if="!!content" class="content" :class="{ onlyContent: !showTitle }">{{ content }}</p>
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
        default: '请等待...',
      },
      content: { // 显示的提示内容
        type: String,
      },
      showTitle: { // 是否显示提示标题
        type: Boolean,
        default: true,
      },
      closeBtn: { // 是否显示关闭图标
        type: Boolean,
        default: true,
      },
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
      },
    },
  };
</script>

<style scoped lang="scss">
#waitMoment{
  background: transparent;
  width: 70%;
  .close-icon{
    color: #5C5C5C;
    font-size: 0.24rem;
    display: inline-block;
    position: absolute;
    right: 0;
    top: -0.35rem;
    z-index: 5000;
  }
  .waitMomentWrap{
    border-radius: 0.06rem;
    background-color: #fff;
    .pic{
      font-size: 0;
    }
    .wait{
      line-height: 1;
      font-size: 0.18rem;
      text-align: center;
      padding: 0.3rem 0 0.15rem;
      color: #212121;
    }
    .content{
      padding-bottom: 0.28rem;
      line-height: 1;
      color: #757575;
      font-size: 0.16rem;
      text-align: center;
      &.onlyContent{
        padding: 0.15rem 0;
      }
    }
  }
}
</style>
