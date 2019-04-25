<!--等待动画-->
<template>
  <mt-popup
    v-model="popupVisible"
    position="middle"
    :closeOnClickModal="false"
    id="tipDialog">
    <div class="tipDialogWrap">
      <p class="tip-header"></p>
      <div class="wuhen flex">
        <i class="icon-wuhen"></i>
        <p>关闭浏览器无痕模式</p>
      </div>
      <div class="location flex">
        <i class="icon-location"></i>
        <p>开启gps位置授权</p>
      </div>
      <div class="camera flex">
        <i class="icon-camera"></i>
        <p>开启摄像头授权</p>
      </div>
      <div @click="btnClick" class="btn">好的</div>
    </div>
  </mt-popup>
</template>

<script>
  export default {
    name: 'tipDialog',
    props: {
      visible: { // 是否显示
        type: Boolean,
        default: false,
      }
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
        localStorage.setItem('visited', 'true');
        this.$emit('update:visible', newValue);
      }
    },
    methods: {
      btnClick() {
        this.popupVisible = false;
        this.$emit('tipClick');
      }
    }
  };
</script>

<style scoped lang="scss">

  #tipDialog {
    background: transparent;
    width: 70%;

    .tipDialogWrap {
      margin: 0 auto;
      width: 2.7rem;
      padding-bottom: 0.3rem;
      border-radius: 0.06rem;
      background-color: #fff;

      .tip-header {
        height: 1rem;
        @include bg-image('~@/assets/h5processImages/identification/icon-tip-header', center/cover no-repeat);
      }

      > div.flex {
        padding: 0.2rem 0.2rem 0.11rem;

        i {
          display: block;
          width: 0.3rem;
          height: 0.3rem;

          &.icon-wuhen {
            @include bg-image('~@/assets/h5processImages/identification/icon-wuhen', center / contain no-repeat);
          }

          &.icon-location {
            @include bg-image('~@/assets/h5processImages/identification/icon-location', center / contain no-repeat);
          }

          &.icon-camera {
            @include bg-image('~@/assets/h5processImages/identification/icon-camera', center / contain no-repeat);
          }
        }

        p {
          margin-top: 0.08rem;
          padding-left: 0.15rem;
          font-size: 0.14rem;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(33, 33, 33, 1);
          height: 0.14rem;
          line-height: 0.14rem;
        }
      }

      .btn {
        margin: 0.19rem auto 0;
        width: 2.3rem;
        height: 0.4rem;
        line-height: 0.4rem;
        background: linear-gradient(90deg, rgba(249, 201, 55, 1) 0%, rgba(255, 211, 78, 1) 100%);
        box-shadow: 0 5px 5px 0 rgba(253, 189, 0, 0.11);
        border-radius: 0.2rem;
        text-align: center;
        font-size: 0.16rem;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(33, 33, 33, 1);
        cursor: pointer;
      }
    }
  }
</style>
