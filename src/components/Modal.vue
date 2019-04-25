<!-- Modal组件 -->
<template>
  <div>
    <transition name="fade">
      <div class="modal-back" v-if="show"></div>
    </transition>
    <transition name="slide">
      <div class="modal-front" v-if="show" @click.self="cancel">
        <div class="modal-content">
          <div class="close" @click="cancel">
            <img src="./../assets/images/common/close@2x.png" alt="关闭">
          </div>
          <slot name="content"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default{
    props: {
      show: {
        type: Boolean,
        default: false
      },
      topImg: {
        type: String,
      },
    },
    data () {
      return {
      }
    },
    methods: {
      cancel(e) {
        this.$emit('close');
        console.log('=====');
      },
    },
  }
</script>

<style scoped>
  .modal-back {
    background-color: rgba(0, 0, 0, 0.5);
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9900;
    overflow: hidden;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    opacity: 1;
  }
  .modal-front {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 9901;
    overflow: hidden;
    /* -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0) */
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: .3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: .3s;
  }
  .slide-enter,
  .slide-leave-to {
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
  .modal-content {
    position: relative;
    width: 74%;
    border-radius: 5px;
    background-color: #fff;
  }
  .close {
    position: absolute;
    right: 8px;
    top: 8px;
    width: 24px;
    height: 24px;
    padding: 4px 6px;
    background-color: #efefef;
    border-radius: 24px;
    overflow: hidden;
    z-index: 2;
  }
  .close img {
    width: 12px;
    height: 12px;
  }

</style>
