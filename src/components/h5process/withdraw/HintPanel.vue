<template>
  <div class="withdraw-tip">
		<div class="bg-white tip-content">
			<p class="fc-21 fz-px-18 text-center p-t-15">提现提示</p>
			<div class="tip-divider m-t-5">
				<div class="left"></div>
				<hr class="hr"/>
				<div class="left right"></div>
			</div>

      <div class="stip" :class="index == 0?'m-t-5':'m-t-20'" v-for="(item, index) in message" :key="index">
				<img :src="require('@/assets/images/withdraw/stip-' + (index+1) + '.png')" width="23" height="23">
				<div class="span-1 m-l-10">
					<p class="fc-21 fz-px-15">{{item.content}}</p>
					<p class="fz-px-15 fc-warn  m-t-15" v-if="item.summary">{{item.summary}}</p>
				</div>
			</div>
<!--

			<div class="stip m-t-5">
				<img src="../../assets/images/withdraw/stip-1.png" width="23" height="23">
				<div class="span-1 m-l-10">
					<p class="fc-21 fz-px-15">提现{{label}}</p>
					<p class="fz-px-15 fc-warn  m-t-15">请不要转出该笔款项，转出后将导致剩余金额无法成功提现。</p>
				</div>
			</div>

			<div class="stip m-t-20">
				<img src="../../assets/images/withdraw/stip-2.png" width="23" height="23">
				<div class="span-1 m-l-10">
					<p class="fc-21 fz-px-15">{{label}}将被自动划扣</p>
				</div>
			</div>

			<div class="stip m-t-20">
				<img src="../../assets/images/withdraw/stip-3.png" width="23" height="23">
				<div class="span-1 m-l-10">
					<p class="fc-21 fz-px-15">划扣成功后，请继续提现剩余金额</p>
				</div>
			</div> -->
		</div>
	</div>
</template>
<script>
export default {
  name: "HintPanel",
  props: {
    message: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
    };
  },
  components: {},
  methods: {}
};
</script>
<style scoped lang="scss">
.withdraw-tip {
  background: url("~@/assets/images/withdraw/drawing-tip-bg.png") no-repeat;
  margin: pxToRem(15) pxToRem(15) pxToRem(30) pxToRem(15);
  background-size: 100% auto;
  display: flex;
  .tip-content {
    margin: pxToRem(6) pxToRem(9) 0 pxToRem(9);
    border-radius: pxToRem(6);
    padding-bottom: pxToRem(20);
    flex: 1;
  }
}


.stip {
  display: flex;
  padding: 0 pxToRem(20);
}


.fc-warn {
  color: #f33f3d;
}

.tip-divider {
  display: flex;
  align-items: center;

  .left {
    width: pxToRem(9);
    height: pxToRem(18);
    background-color: $backgroundColor;
    border-radius: 0 pxToRem(18) pxToRem(18) 0;
  }
  .right {
    border-radius: pxToRem(18) 0 0 pxToRem(18);
  }

  .hr {
    height: 1px;
    border: none;
    flex: 1;
    border-top: 1px solid #e7e7e7;
    margin: 0 pxToRem(10);
  }
}

</style>
