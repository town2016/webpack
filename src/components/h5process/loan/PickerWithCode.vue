<!-- Picker组件 使用文档：https://github.com/naihe138/vue-picker -->
<template>
  <div
    id="h-picker"
    :class="className"
    v-if="show"
  >
    <div class="picker-shade">
      <div
        class="area_ctrl"
      >
        <div class="area_btn_box">
          <div
            class="area_btn_title"
            @click="close"
            v-if="title"
          >{{title}}</div>
          <div
            class="area_btn area_finish"
            @click="close"
          ></div>
        </div>
        <div class="area_roll">
          <div
            class="tooth00"
            v-for="(item,index) in pData1"
            :key="index"
            @click="finish(item)"
            :data-id='index'
          >{{item.text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    selectData: {
      type: Array,
      default: {}
    },
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pData1: [],
    }
  },
  methods: {
    close: function (e) {
      this.$emit('cancel')
      e.preventDefault();
    },
    finish: function (e) {
      this.$emit('confirm', e)
      event.preventDefault();
    },
    setTop(e) {

    },
    init() {
      // console.log(this.selectData);
      this.pData1 = this.selectData;
    }
  },
  created() {
    this.init()
  },
  watch: {
    selectData: {
      handler: function () {
        this.init()
      },
      deep: true
    },
  }
}
</script>

<style scoped lang="scss">
#h-picker {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
}
.picker-shade {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 999;
}

.picker-income{
  .area_ctrl{
    position: absolute;
    left: 0;
    bottom: 0;
    margin: 0;
    width: 100%;
    height: 2.1rem;
    font-size: 12px;
    vertical-align: middle;
    background-color: #fff;
    color: #000;
    z-index: 9901;
    overflow: hidden;
  }
}

.picker-industry{
  .area_ctrl{
    position: absolute;
    left: 0;
    top: 1.2rem;
    bottom: 0;
    margin: 0;
    width: 100%;
    font-size: 12px;
    vertical-align: middle;
    background-color: #fff;
    color: #000;
    z-index: 9901;
    overflow: hidden;
  }
}

.area_btn_title {
  color: #979797;
  text-align: center;
  padding: 0 0.15rem;
  line-height: 0.6rem;
}

.area_btn{
  position: absolute;
  top: 0.21rem;
  right: 0.15rem;
  width: 0.17rem;
  height: 0.17rem;
  @include bg-image('~@/assets/h5processImages/common/pop-close',center/100% 100% no-repeat);
}

.area_btn_title {
  font-size: 0.18rem;
  font-weight: 500;
  color: rgba(33, 33, 33, 1);
}

.area_btn_box:before,
.area_btn_box:after {
  content: "";
  position: absolute;
  height: 1px;
  width: 100%;
  display: block;
  background-color: #96979b;
  z-index: 15;
  -webkit-transform: scaleY(0.33);
  transform: scaleY(0.33);
}

.area_btn_box {
  position: absolute;
  left: 0;
  width: 100%;
  height: 0.6rem;
  background-color: #fff;
}

.area_btn_box:before {
  left: 0;
  top: 0;
  -webkit-transform-origin: 50% 20%;
  transform-origin: 50% 20%;
}

.area_btn_box:after {
  left: 0;
  bottom: 0;
  -webkit-transform-origin: 50% 70%;
  transform-origin: 50% 70%;
}
.area_roll{
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0.6rem;
  width: 100%;
  overflow: scroll;
}
.tooth00 {
  font-size:0.15rem;
  font-weight:400;
  color:rgba(33,33,33,1);
  line-height: 0.5rem;
  margin: 0 0.15rem;
}
</style>

