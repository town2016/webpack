<!--copy弹框提示-->
<template>
  <div class="navigation-bar-container">
    <ul class="navigation-bar">
      <li class="bar">
        <div class="process" v-bind:class="processClass(1)">
          <span>1</span>
        </div>
        <p class="tips" v-bind:class="index >= 1 ? 'tips-now' : ''">实名认证</p>
        <p class="line-bar1" v-bind:class="index >= 1 ? 'line-bar-now' : ''"></p>
      </li>
      <li class="bar">
        <div class="process" v-bind:class="processClass(2)">
          <span>2</span>
        </div>
        <p class="tips" v-bind:class="index >= 2 ? 'tips-now' : ''">评估额度</p>
        <p class="line-bar23" v-bind:class="index >= 2 ? 'line-bar-now' : ''"></p>
      </li>
      <li class="bar">
        <div class="process" v-bind:class="processClass(3)">
          <span>3</span>
        </div>
        <p class="tips" v-bind:class="index >= 3 ? 'tips-now' : ''">借款</p>
        <p class="line-bar23" v-bind:class="index >= 3 ? 'line-bar-now' : ''"></p>
      </li>
      <li class="bar">
        <div class="process" v-bind:class="processClass(4)">
          <span>4</span>
        </div>
        <p class="tips" v-bind:class="index >= 4 ? 'tips-now' : ''">提现</p>
        <p class="line-bar4" v-bind:class="index >= 4 ? 'line-bar-now' : ''"></p>
      </li>
    </ul>
  </div>
</template>

<script scoped>
import allBankList from "@/utils/bankList";

export default {
  name: "CopyModal",
  data() {
    return {};
  },
  props: {
    index: {
      // 提示文字
      type: [Number, String],
      default: 1
    }
  },
  computed: {},
  methods: {
    processClass: function(num) {
      if (num < this.index) {
        return "past";
      } else if (num == this.index) {
        return "now";
      } else {
        return "waiting";
      }
    }
  }
};
</script>
<style scoped lang="scss">
.navigation-bar-container {
  background-color: white;
}
.navigation-bar {
  padding: 0.1rem 0;
  position: relative;
  background-color: white;
  overflow: hidden;
  width: 3.6rem;
  margin: 0 auto;
}
.bar {
  width: 0.9rem;
  float: left;
  position: relative;
}
.process {
  margin: 0.1rem auto;
  width: 0.18rem;
  height: 0.18rem;
  text-align: center;
  line-height: 0.18rem;
  box-sizing: border-box;
  background-color: white;
  position: relative;
  z-index: 99;
  font-size: 0.12rem;
}
.past {
  border-radius: 50%;
  // @include bg-image("~@/assets/h5processImages/common/right");
  background-color: rgb(255, 211, 78);
  background-size: 100% 100%;
}
.now {
  border-radius: 50%;
  background-color: rgb(255, 211, 78);
  color: #212121;
}
.waiting {
  border-radius: 50%;
  color: white;
  background-color: rgb(193, 193, 193);
}
.tips {
  text-align: center;
  font-size: 12px;
  color: rgb(193, 193, 193);
  font-weight: 600;
}
.line-bar1 {
  position: absolute;
  right: 0;
  top: 0.17rem;
  height: 0;
  width: 0.45rem;
  border-bottom: 2px solid rgb(193, 193, 193);
  z-index: 9;
}
.line-bar23 {
  position: absolute;
  left: 0;
  top: 0.17rem;
  height: 0;
  width: 0.9rem;
  border-bottom: 2px solid rgb(193, 193, 193);
  z-index: 9;
}
.line-bar4 {
  position: absolute;
  left: 0;
  top: 0.17rem;
  height: 0;
  width: 0.45rem;
  border-bottom: 2px solid rgb(193, 193, 193);
  z-index: 9;
}
.line-bar-now {
  border-color: rgb(255, 211, 78) !important;
}
.tips-now {
  color: black;
}
</style>
