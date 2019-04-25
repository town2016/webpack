<template>
  <div class="app-download">
    <div class="content">
      <div class="logo"></div>
      <div class="text">
        <p class="app-name fc-21 fz-px-16">{{appName}}</p>
        <p class="app-desc fc-75 fz-px-12">{{appDesc}}</p>
      </div>
      <a :href="downloadUrl" target="_blank" class="fc-21 fz-px-12 m-t-25">下载</a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppDownload',
  props: {
    downloadUrl: {
      type: String,
      default: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.rongxin.wellloan'
    }
  },
  data() {
    return {
      appName: '畅快贷App',
      appDesc: '额度最高提升到10万元，借款更流畅！'
    }
  }
};

</script>
<style lang="scss" scoped>
.app-download {
  width: 100%;
  padding: 0 0.15rem;
  .content{
    display: flex;
    display: -webkit-flex;
    box-shadow: 0 7px 11px 0 rgba(253, 189, 0, 0.12);
  }
  .logo {
    width: 0.5rem;
    height: 0.5rem;
    margin: 0.12rem 0 0.12rem 0.12rem;
    @include bg-image('~@/assets/h5processImages/home/logo', center/100% 100% no-repeat)
  }
  .text {
    flex: 1;
    margin-left: 0.05rem;
    .app-name {
      margin-top: 0.14rem;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      line-height: 0.23rem;
    }
    .app-desc {
      margin-top: 0.06rem;
      line-height: 0.17rem;
    }
  }
  a {
    margin-right: 0.1rem;
    width: 0.6rem;
    height: 0.25rem;
    line-height: 0.25rem;
    text-align: center;
    background: linear-gradient(90deg, #F9C937 0%, #FFD34E 100%);
    border-radius: 0.25rem;
    &:active, &:link, &:visited, &:hover {
      color: #212121;
    }
  }
  @media screen and (max-device-width: 320px){
    .logo{
      width: 0.46rem;
      height: 0.46rem;
      margin-left: 0;
    }
    .text{
      margin-left: 0;
    }
    a{
      width: 0.52rem;
      margin-right: 0;
    }
  }

  @media screen and (max-device-width: 360px) and( min-device-width: 321px){
    .logo{
      margin-left: 0.07rem;
    }
    .text{
      margin-left: 0.04rem;
    }
    a{
      margin-right: 0.07rem;
    }
  }

}

</style>
