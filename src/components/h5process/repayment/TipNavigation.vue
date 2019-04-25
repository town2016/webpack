<template>
  <div class="home-tips-wrap">
    <span class="fz-px-12">
      {{text}}
      <i v-if='showArrow' class="home-tips-arrow"></i>
    </span>
  </div>
</template>
<script>
export default {
  name: 'TipNavigation',
  props: {
    text: { //列表数据，必选
      type: String,
      required: true,
    },
    showArrow: {
      type: Boolean,
      default: true,
    }
  },
}

</script>
<style lang="scss" scoped>
.home-tips-wrap {
  position: relative;
  height: 0.3rem;
  line-height: 0.3rem;
  color: #FD734C;
  text-align: center;
  background-color: #F5E4DF;
}

.home-tips-wrap {
  position: relative;
  height: 0.3rem;
  line-height: 0.3rem;
  color: #FD734C;
  text-align: center;
  background-color: #F5E4DF;
}

.home-tips-arrow {
  position: absolute;
  width: 0.18rem;
  height: 0.18rem;
  top: 50%;
  right: 0.1rem;
  transform: translateY(-50%);
  background: url('~@/assets/images/home/icon-arrow.svg');
  background-size: cover;
}

</style>
