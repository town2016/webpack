<!--业务授权-->
<template>
	<div id="authorization">
		<text-input
			label="手机号"
			:value="telPhone"
			@input="phoneInput"
			type="tel"
			:maxlength="11"
			placeholder="请输入银行预留手机号"
			class="inputCell"
		/>
		<!--开通按钮-->
		<div class="buttonContainer">
			<mt-button class="button" size="large" type="primary" :disabled="disabled" @click.native="nextClick">下一步</mt-button>
		</div>
	</div>
</template>

<script>
	import { Indicator, Toast } from 'mint-ui';
	import Api from '@/api';
	import TextInput from '@/components/iqiyi/input/TextInput';
	import storage from '@/utils/storage';

	export default {
		name: 'authorization',
		data() {
			return {
				telPhone: '',
				addCardInfo: JSON.parse(storage.read('addCardInfo')),
			};
		},
		// props: ['addCardInfo',],
		computed: {
			disabled() {
				return !(this.telPhone.toString().length === 11);
			}
		},
		components: {
			TextInput,
		},
		beforeRouteLeave (to, from, next) {
			// 导航离开该组件的对应路由时调用
			// 可以访问组件实例 `this`
			next();
		},
		created() {

		},
		methods: {
			phoneInput(value) {
				this.telPhone = value;
			},
			nextClick() {
				const { action, } = this.addCardInfo;
				if (action === 'add') {
					this.addBankCard();
				} else if (action === 'bindCG') {
					this.toBindCG();
				} else if (action === 'unbind') {
					this.unbind();
				}
			},
			async addBankCard() {
				const {
					cardNo,
					bankName,
					order,
					bankAccount,
					callbackUrl,
				} = this.addCardInfo;
				try {
					Indicator.open();
					const data = await Api.bankCard.addBankCard(cardNo, bankName, order, bankAccount, this.telPhone, callbackUrl);
					Indicator.close();
					if (data.status === 200 && data.result) { // 成功
						location.href = data.result;
					} else {  // 失败
						Toast(data.desc);
					}
				} catch (error) {
					Indicator.close();
					Toast(error);
					console.log(error);
				}
			},
			async toBindCG(item) {
				const {
					bankInfo,
					callbackUrl,
				} = this.addCardInfo;
				try {
					Indicator.open();
					let bankCardInfo = {
						bankAccno: bankInfo.bankAccno,
						bankAccount: bankInfo.bankAccount,
						mobile: this.telPhone,
					};
					const data = await Api.bankCard.getBindBankCardHttpRequestUrl(bankCardInfo, callbackUrl);
					Indicator.close();
					if (data.status === 200 && data.result) { // 成功
						location.href = data.result;
					} else {  // 失败
						let desc = data.desc ? data.desc : '没有获取到第三方绑卡链接';
						Toast(desc);
					}
				} catch (error) {
					Indicator.close();
					Toast(error);
					console.log(error);
				}
			},
			async unbind() {
				const {
					cardNo,
					bankAccount,
					callbackUrl,
				} = this.addCardInfo;
				try {
					Indicator.open();
					let callbackUrl = this.preUrl;
					const data = await Api.bankCard.unbind(cardNo, bankAccount, callbackUrl);
					Indicator.close();
					if (data.status === 200 && data.result) { // 成功
						// if (this.item.isGFBind) { //绑定了存管账户的，跳转广发解绑页面进行解绑操作
						// 	this.unBindCG();
						// } else {
						// 	Toast('删除成功');
						// 	this.$router.go(-1);
						// }
						if (data.result.status === 2 && data.result.url) {
							location.href = data.result.url;
						} else {
							Toast('删除成功');
							this.$router.go(-1);
						}
					} else {  // 失败
						Toast(data.desc);
					}
				} catch (error) {
					Indicator.close();
					Toast(error);
					console.log(error);
				}
			},
		},
	};
</script>

<style scope lang="scss">
	#authorization {
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		flex: 1;
		overflow: scroll;
		-webkit-overflow-scrolling: touch;
	}
	.buttonContainer {
		width: 100%;
		padding: 0 15px;
		.button {
		    border-radius: 0.9rem;
		    background-color: rgb(54,142,255);
		    margin-top: 0.3rem;
		}
	}
	.inputCell {
		margin-top: 0.2rem;
	}
</style>
