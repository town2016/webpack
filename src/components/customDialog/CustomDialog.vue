<template>
  <transition name='fade'>
    <div v-show='visible' :class='position' class='customDialog'>
      <div class="msg">{{message}}</div>
      <div class="btn-wrap">
        <mt-button 
          @click="callback"
          class="btn-confirm fz-px-12">
          {{ btnMessage }} 
          <span v-if="isShowDuration">{{durations}}</span>
        </mt-button>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'CustomDialog',
    data() {
      return {
        visible: false,
        message: '',
        btnMessage: '',
        position: '',
        duration: 0,
        isShowDuration: false
      };
    },
    computed: {
      durations() {
        return Math.floor(this.duration/1000);
      }
    },
    mounted() {
      if(this.isShowDuration) {
        this.timing()
      }
    },
    methods: {
      callback: function() {
        alert('callback')
      },
      timing() {
        setTimeout(() => {
          if(this.duration === 0) {
            this.callback && this.callback()
            return;
          }
          this.duration = this.duration - 500;
          this.timing();
        }, 500)
      }
    }
  }
</script>
 
 
<style scoped>
  .customDialog {
    position: fixed;
    left: 50%;
    width: 3rem;
    height: 2rem;
    border-radius: 5px;
    transform: translate(-50%,-50%);
    background: #fff;
    color: #333;
    font-size: .16rem;
    text-align: center;
    word-wrap: break-word;
    overflow: hidden;
    z-index: 9999;
    transition: 0.2s;
    box-shadow: 0 1px 1px 0px rgba(0,0,0,0.1)
  }
  .msg {
    height: 1.3rem;
    line-height: 1.65rem;
  }
  .btn-wrap {
    height: 0.7rem;
    line-height: 0.7rem;
  }
  .btn-confirm {
    height: 0.35rem;
    color: #fff;
    font-size: 0.16rem;
    border: 1px solid #F7A206;
    background-color: #F7A206;
  }
  .customDialog.middle{
    top:50%;
  }
  .customDialog.top{
    top:10%;
  }
  .customDialog.bottom{
    top:90%;
  }
  .fade-enter-active, .fade-leave-active {
    opacity: 1;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
</style>