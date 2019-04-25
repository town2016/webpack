<template>
  <div class="withdraw-cell">
      <div class="horizontal-center">
				<img :src="require('@/assets/images/withdraw/icon-logo.png')" width="18" height="18" alt="logo">
				<span class="fc21 f16 pl10 span1">{{ value.cat_type }}</span>
				<span class="fc21 f16 pl10">{{ value.lend_money.toFixed(2) }}元</span>
      </div>
      <p class="horizontal-center lr mt15" v-if="value.no_cash_money > 0">
				<span class="fc75 f13">可提现金额</span><span class="fc75 f13">{{ value.no_cash_money.toFixed(2) }}元</span>
			</p>
			<p class="horizontal-center lr mt15" v-if="value.cash_money > 0">
				<span class="fc75 f13">已提现金额</span><span class="fc75 f13">{{ value.cash_money.toFixed(2) }}元</span>
			</p>
			<p class="horizontal-center lr mt15" v-if="value.tail > 0">
				<span class="fc75 f13">押尾款（暂不可提现）</span><span class="fc75 f13">{{ value.tail.toFixed(2) }}元</span>
			</p>

			<p class="horizontal-center lr mt15">
				<span class="lose" v-show="value.cancel">借款已过期失效</span>
				<span></span>
				<label
					v-if="value.isRecharge === 'Y' && value.wait_recharge_money != undefined && value.wait_recharge_money >= 0"
					class="btn-withdraw btn-recharge"
					@click="_click">缴纳</label>
				<label v-else
					class="btn-withdraw"
					:class="(value.cancel || value.no_cash_money == 0)?['btn-withdraw', 'disabled']:'btn-withdraw'"
					@click="_click">提现</label>
			</p>
  </div>
</template>
<script>
export default {
	name: 'WithdrowCell',
	props: {
		value: {
			type: Object,
			default: {}
		}
	},
  data () {
    return {
    };
  },
  components: {
  },
  methods: {
		_click: function() {
			this.$emit('onWithdraw')
		}
  },
}
</script>
<style scoped lang="scss">
.withdraw-cell {
  background: #fff;
  width: 100%;
  padding: 0.16rem;

	.btn-withdraw {
		background: #F7A206;
		font-size: 13px;
		padding: 0.06rem 0.25rem;
		border-radius: 0.9rem;
		color: #fff;
	}

	.disabled {
		background: #C1C1C1;
	}

	.lose {
		color: #F33F3D;
		font-size: 13px;
	}

	.btn-recharge {
		background: white;
		border: 1px solid #F7A206;
		color: #F7A206;
	}
}

.horizontal-center {
  display: flex;
  flex-direction: row;
	align-items: center;
}

.fc21 {
	color: #212121;
}

.fc75 {
	color: #757575;
}

.f16 {
	font-size: 0.16rem;
}

.f13 {
	font-size: 0.13rem;
}

.pl10 {
	padding-left: 0.1rem;
}

.span1 {
	flex: 1;
}

.lr {
	justify-content: space-between;
}

.mt15 {
	margin-top: 0.08rem;
}


</style>
