<!--业务授权-->
<template>
	<div id="authorization">
		<div class="top">
			<img :src="require('@/assets/images/components/authorization/bg.png')" width="100%" />
			<div class="tipsText">				
				<p>平台已接入广发银行资金存管系统</p>
				<p>借款、还款等资金操作均需开通业务授权</p>
			</div>
		</div>
		<!--开通按钮-->
		<div class="buttonContainer">
			<mt-button class="button" size="large" type="primary" :disabled="false" @click.native="nextClick">开通</mt-button>
		</div>
		<div class="tipsBtn" @click="toChangeData"><span>点击“开通”按钮表示你同意《业务授权》内容</span><img :src="require('@/assets/images/components/authorization/arrow_right.png')"/></div>
	</div>
</template>

<script>
	import { Indicator, Toast, MessageBox, } from 'mint-ui';
	import Api from '@/api';
	import { mapGetters } from 'vuex';
	import { isBackFromCG, isWeixin, closeWeixinWindow, } from '@/utils/common';

	export default {
		name: 'authorization',
		data() {
			return {
			};
		},
		computed: {
			...mapGetters({
				authorizationData: 'authorizationData', // 授权信息
			}),
		},
		beforeRouteLeave (to, from, next) {
			// 导航离开该组件的对应路由时调用
			// 可以访问组件实例 `this`
			if (!to.name === 'changeAuthorization') {				
				let obj = {
					amount: '500000000',//单位分
					date: '20221231',
				}
				this.$store.commit('CHANGE_AUTHORIZATION_AMOUNT', obj);
				this.$store.commit('CHANGE_AUTHORIZATION_DATE', obj);
			}
			next();
		},
		components: {
		},
		async created() {
			this.$store.commit('COMMON_CONFIG', { // 组件创建的时候，去修改common.js中配置项的状态
				showTabbar: false,   // 不显示tabbar
			});

			let url = location.href;
			let isFromCG = isBackFromCG(url);
			if (isFromCG) {
				await this.$store.dispatch('parseReceiptUrl', { url, });
				if (isWeixin()) {
					closeWeixinWindow();
				}
			} else {
				await this.checkLegalState();
			}
		},
		methods: {
			async checkLegalState () {
				try {
					Indicator.open();
					const data = await Api.bankCard.checkCustomerLegalInfo();
					Indicator.close();
					if (data.status === 200 && data.result) {
						if (data.result.authorityStatus === 1 && data.result.validate) { // 已进行过业务授权
							MessageBox.alert('你已进行过业务授权，无需再授权', '').then(action => {
								history.go(-1);
							});
						} else if (data.result.openAccountStatus !== 0 && data.result.openCompanyAccountStatus !== 0) { // 未开通存管
							MessageBox.alert('请先开通存管账户', '', {
								confirmButtonText: '去开通',
								showCancelButton: true,
							}).then(action => {
								if (action === 'confirm') {
									this.$router.replace({ name: 'openAccount', });
								} else {
									history.go(-1);
								}
							});
						} else if (data.result.activateStatus !== 0) { // 账户未激活
							MessageBox.alert('请先激活账户', '', {
								confirmButtonText: '立即激活',
								showCancelButton: true,
							}).then(action => {
								if (action === 'confirm') {
									this.goActiveAccount(); // 跳转广发进行账户激活
								} else {
									history.go(-1);
								}
							});
						}
					}
				} catch (error) {
					Indicator.close();
					// console.log(error);
				}
			},
			async goActiveAccount() { // 跳转广发进行激活账户
				try {
					Indicator.open();
					let callbackUrl = location.href;
					const data = await Api.bankCard.getActiveCustomerHttpRequestUrl(callbackUrl);
					Indicator.close();
					if (data.status === 200 && data.result) {
						location.href = data.result;
					} else if (data.status === 500 && data.desc) {
						Toast(data.desc);
					}
				} catch (error) {
					Indicator.close();
					console.log(error);
				}
			},
			toChangeData() {
				this.$router.push({ name: 'changeAuthorization', });
			},
			async nextClick() {
				try {
					Indicator.open();
					let callbackUrl = location.href;
					const data = await Api.bankCard.professionAuthorization(this.authorizationData.amount, this.authorizationData.date, callbackUrl);
					Indicator.close();
					if (data.status === 200 && data.result && data.result.authorityHttpRequestUrl) { // 成功
						location.href = data.result.authorityHttpRequestUrl;
					} else {  // 失败
						let desc = data.desc ? data.desc : '没有获取到第三方绑卡链接';
						Toast(desc);
					}
				} catch (error) {
					Indicator.close();
					Toast(error);
					console.log(error);
				}
			}
		},
	};
</script>

<style scope lang="scss">
	#authorization {
		width: 100%;

		.top {
			position: relative;
			width: 100%;
			margin-bottom: 20px;

			.tipsText {
				position: absolute;
				bottom: 0.44rem;
				font-size: 0.16rem;
				color: #ffffff;
				line-height: 0.24rem;
				text-align: center;
				width: 100%;
			}
		}
		.buttonContainer {
			width: 100%;
			padding: 0 15px;
			.button {
		    // margin: 0 15px;
		    border-radius: 0.9rem;
		    background-color: rgb(54,142,255);
		}
	  }
	  .tipsBtn {
	  	font-size: 13px;
	  	color: rgb(117,117,117);
	  	text-align: center;
	  	line-height: 18px;
	  	margin-top: 17px;

	  	span {
	  		vertical-align: 0.05rem;
	  	}
	  }
	}
</style>