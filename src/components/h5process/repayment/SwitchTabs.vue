<template>
  <div class="switch-tabs">
    <div :class='{active:selIndex===index}' v-for='(item,index) in itemsConf' :key='index' @click='switchTab(index)'>
      <div class="tsb_txt">{{item.text}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SwitchTabs',
  components: {},
  props: {
    itemsConf: { //tabs配置
      type: Array,
      required: true,
    },
    dfSelIndex: { //默认选中
      type: Number,
      default: 0,
    }
  },
  methods: {
    switchTab(index) {
      this.selIndex = index;
      this.$emit('tabsSwitch', index);
    }
  },
  data() {
    return {
      selIndex: null,
    };
  },
  created() {
    this.selIndex = this.dfSelIndex;
  },
};

</script>
<style lang="scss" scoped>
.switch-tabs {
  height: .45rem;
  line-height: .45rem;
  display: flex;
  color: #212121;
  font-size: .15rem;
  background-color: #fff;
  &>div {
    flex: 1;
    text-align: center;
    &.active .tsb_txt {
      border-bottom: 2px solid $themeColor;
    }
  }
  .tsb_txt {
    display: inline-block;
    line-height: .45rem;
    height: .45rem;
    padding: 0 0.04rem;
  }
}

</style>
