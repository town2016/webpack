<template>
  <div class="container">
    <div class='icon'></div>
    <div class="description"></div>
    <div ref="btn" class="download-btn"
         v-clipboard:copy="message"
         v-clipboard:success="onCopy"
         v-clipboard:error="onError"
    ></div>
    <p>请在浏览器中粘贴并打开链接</p>
  </div>
</template>
<script>
  import { Toast } from 'mint-ui';

  export default {
    name: 'download',
    data() {
      return {
        message: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rongxin.wellloan',
      }
    },
    methods: {
      onCopy(e) {
        Toast('复制成功！请使用浏览器打开');
      },
      onError() {
        Toast('抱歉，浏览器不支持复制功能')
      }
    },
    created() {

    }
  };

</script>
<style lang="scss" scoped>
  .container {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    text-align: center;
  }

  .icon {
    width: 1.65rem;
    height: 1.5rem;
    @include bg-image('~@/assets/h5processImages/common/note', center/contain no-repeat);
    margin: 1.17rem auto 0;
  }

  .description {
    width: 2.37rem;
    height: 0.66rem;
    margin: 0.08rem auto 0;
    @include bg-image('~@/assets/h5processImages/common/download-text', center / contain no-repeat);
  }

  .download-btn {
    margin: 0.25rem auto 0;
    width: 2.504rem;
    height: 0.59rem;
    @include bg-image('~@/assets/h5processImages/common/download-btn', center / contain no-repeat);
  }

  p{
    margin-top: 0.19rem;
    font-size: 0.14rem;
    font-family:PingFang-SC-Medium;
    color:rgba(87,62,11,1);
    line-height:  0.2rem;
    opacity: 0.6;
  }

</style>
