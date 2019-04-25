<template>
  <div class="list-state">
    <div class='icon'></div>
    <div class="description">加载失败～～</div>
    <div class="error-btn" @click='reload'>重新加载</div>
  </div>
</template>
<script>
export default {
  name: 'ErrorPage',
  methods: {
    reload() {
      this.$router.replace(decodeURIComponent(this.$route.params.origin));
    },
  },
  mounted() {
    // setTimeout(()=>{
    //   this.reload();
    // },3000);
  }
};

</script>
<style lang="scss" scoped>
.list-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
  z-index: 999;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('~@/assets/images/repay/error.png');
  margin: 0 auto;
}

.description {
  font-size: .14rem;
  color: #757575;
  text-align: center; // margin-top: 0.1rem;
}

.error-btn {
  width: 1.5rem;
  height: .32rem;
  line-height: .32rem;
  text-align: center;
  margin: 0.2rem auto 0;
  color: #e84438;
  border: 1px solid #e84438;
  border-radius: 0.16rem;
  font-size: 0.15rem;
}

</style>
