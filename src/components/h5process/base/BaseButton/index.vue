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
  font-weight: bold;
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

.gray {
  background-color: #c1c1c1;
  color: #fff;
}

.yellow {
  background: linear-gradient(to right, #f9c937, #ffd34e);
  box-shadow: 0 7px 5px 0 rgba(253, 189, 0, 0.12);
  color: #212121;
}

.orange {
  background: linear-gradient(to right, #ff5927, #ff9b0c);
  box-shadow: 0 7px 5px 0 rgba(253, 189, 0, 0.12);
  color: #fff;
}

.orange-yellow {
  background: linear-gradient(to right, #ffe87a, #faac0a);
  box-shadow: 0 7px 5px 0 rgba(253, 189, 0, 0.12);
  color: #fff;
}
</style>