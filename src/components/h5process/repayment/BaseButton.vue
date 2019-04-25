<template>
  <div class="button" :class="[type]" :style="{marginTop:mt}">{{text}}</div>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    text: {
      //必选
      required: true,
      type: String
    },
    type: {
      //可选
      default: null, //null表示不设置
      type: String
    },
    mt: {
      //可选
      default: null, //null表示不设置
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  width: 3.45rem;
  height: 0.45rem;
  line-height: 0.45rem;
  text-align: center;
  font-size: 0.16rem;
  border-radius: 0.225rem;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  // &:hover::before { //iphone8出bug
  //   content: "";
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   position: absolute;
  //   border-radius: 0.225rem;
  //   background: rgba(0, 0, 0, 0.1);
  // }
}

.blue {
  background-color: #368eff;
  color: #fff;
}

.white {
  background-color: #fff;
  color: #368eff;
}
</style>