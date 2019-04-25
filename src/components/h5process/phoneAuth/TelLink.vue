<!--运营商联系方式-->
<template>
  <mt-popup
    v-model="popupVisible"
    position="middle"
    id="telLink">
    <div class="telLinkWrap">
      <p class="title">可通过拨打手机运营商客服电话重置</p>
      <div class="content">
        <p><span>中国电信客服电话：</span><a href="tel:10000" class="phoneNumber">10000</a></p>
        <p><span>中国移动客服电话：</span><a href="tel:10086" class="phoneNumber">10086</a></p>
        <p><span>中国联通客服电话：</span><a href="tel:10010" class="phoneNumber">10010</a></p>
      </div>
      <div class="btn">
        <mt-button type="default" size="small" @click.native="popupVisible=false">确定</mt-button>
      </div>
    </div>
  </mt-popup>
</template>

<script>

  export default {
    name: 'telLink',
    props: {
      visible: {
        type: Boolean,
        default: false,
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
#telLink{
  background: transparent;
  width: 72%;
  .telLinkWrap{
    border-radius: 0.12rem;
    background-color: #fff;
    .title{
      color: #4A4A4A;
      font-size: 0.14rem;
      line-height: 0.24rem;
      text-align: center;
      padding-top: 0.29rem;
    }
    .content{
      padding: 0.24rem 0 0.27rem 0;
      font-size: 0.17rem;
      line-height: 0.27rem;
      border-bottom: 1px solid #c1c1c1;
      > p{
        text-align: center;
        > span:first-child{
          color: #030303;
        }
        > .phoneNumber{
          color: #0076FF;
        }
      }

    }
    .btn{
      text-align: center;
      .mint-button--default{
        height: 0.44rem;
        border-color: transparent;
        color: #212121;
        width: 100%;
        background: #fff;
        box-shadow: none;
        border-radius: 0 0 0.12rem 0.12rem;
        &:after{
          background: #c1c1c1;
        }
      }
    }
  }
}
</style>
