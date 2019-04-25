<!-- Picker组件 使用文档：https://github.com/naihe138/vue-picker -->
<template>
  <div class="item-container">
    <img v-if="showImg" class="getlimit-img" :src="showImg">
    <p class="evaluating-tips" v-if="tips">{{tips}}</p>
    <p class="evaluating-info" v-if="info" v-html="info"></p>
    <slot name='info' v-else></slot>
    <BaseButton v-if="button" :text="button" type='yellow' mt='.3rem' @click.native="statusClick"></BaseButton>
  </div>
</template>

<script>
import BaseButton from '@/components/h5process/base/BaseButton';

export default {
  props: {
    showImg: {
      type: String,
      default: ''
    },
    tips: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      pData1: [],
    }
  },
  methods: {
    statusClick: function() {
      this.$emit('statusClick')
    },
    setTop(e) {

    },
    init() {
      this.pData1 = this.selectData;
    }
  },
  created() {

  },
  components: {
    BaseButton,
  },
  watch: {
    // selectData: {
    //   handler: function () {
    //     this.init()
    //   },
    //   deep: true
    // },
  }
}
</script>

<style scoped>
.item-container {
  width: 100%;
  padding: 0.15rem 0.15rem 0 0.15rem;
}

.evaluating-tips {
  font-size: 0.16rem;
  font-weight: 400;
  color: rgba(33, 33, 33, 1);
  line-height: 0.3rem;
  text-align: center;
  margin-top: 0.1rem;
}

.evaluating-info {
  font-size: 0.14rem;
  font-weight: 400;
  color: rgba(117, 117, 117, 1);
  line-height: 1.5;
  width: 2.6rem;
  margin: 0 auto;
  text-align: center;
}

.getlimit {
  position: relative;
}

.getlimit-bg {
  width: 100%;
  display: block;
}

.getlimit-info {
  position: absolute;
  width: 1.5rem;
  height: 1.2rem;
  top: 0.6rem;
  right: 0.3rem;
}

.getlimit-intro {
  position: absolute;
  width: 1.5rem;
  top: 0.8rem;
  left: 0.4rem;
  z-index: 1;
}

.getlimit-intro-title {
  font-size: 0.13rem;
  font-weight: 400;
  color: rgba(33, 33, 33, 1);
  line-height: 0.2rem;
}

.getlimit-intro-limit {
  font-size: 0.4rem;
  font-weight: 500;
  color: rgba(33, 33, 33, 1);
  line-height: 0.6rem;
}

.getlimit-img,
.ruoju-img,
.qiangju-img {
  margin: 0 auto;
  width: 1.59rem;
  height: 1.56rem;
  display: block;
}

.animate-con {
  margin: 0 auto;
  width: 1.59rem;
  height: 1.56rem;
  display: block;
  position: relative;
}

.getlimit-con-bg {
  width: 100%;
  height: 100%;
}

.getlimit-con-item {
  position: absolute;
  width: 0.7rem;
  height: 0.45rem;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 0;
}
</style>