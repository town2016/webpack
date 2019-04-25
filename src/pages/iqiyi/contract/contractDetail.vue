<template>
  <div class="contractDetail">
    <iframe 
      class="contract-content" 
      :src="source" 
      frameborder="0"></iframe>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isImg: null
      }
    },
    computed: {
      source() {
        const isImg = this.$route.query.pdfUrl.match(/(.jpg)+/);
        let url = '';
        if(isImg) {
          url = `../../../static/webview.html?src=${this.$route.query.pdfUrl}`;
        } else {
          url = this.$route.query.pdfUrl;
        }
        return url;
      }
    },
    created() {
      const doc = document;
      let body = doc.querySelector('body');
      body.style.paddingTop = '8px';
      body.style.boxSizing = 'content-box';
      doc.documentElement.scrollTop = 8;
      doc.body.scrollTop = 8;
      window.onscroll = () => {
        doc.documentElement.scrollTop = 8;
        doc.body.scrollTop = 8;
      }
    },
    beforeDestroy() {
      let body = document.querySelector('body');
      body.style.paddingTop = '0px';
      body.style.boxSizing = 'border-box';
      window.onscroll = null;
    }
  }
</script>

<style>
  .contractDetail {
    position: relative;
    width: 100%!important;
    min-height: 100%!important;
  }
  .contract-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%!important;
    height: 100%!important;
  }
  .contract-img {
    width: 100%;
  }
</style>
