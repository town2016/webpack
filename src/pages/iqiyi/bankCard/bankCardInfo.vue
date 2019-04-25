<!--银行卡详情-->
<template>
	<div v-if="cardData.item && cardData.item.cardno" class="container">
		<bank-card-cell :item="cardData.item"/>

		<!--首选还款账户设置按钮-->
		<mt-cell v-if="cardData.showSwitchBtn" title="设为首选还款账户" class="addBtn" >
			<mt-switch v-model="cardData.isFirstAccount" @change="onFirstSwitchChange"></mt-switch>
		</mt-cell>

		<!--继续绑定按钮 绑定存管账户-->
		<template v-if="cardData.showBindCGBtn">
			<div class="buttonContainer">
				<mt-button class="button" size="large" type="primary" :disabled="false" @click.native="continueBind">继续绑定</mt-button>
			</div>
			<p class="unBindtips">该银行卡未绑定存管账户</p>
		</template>

		<!--继续绑定按钮 绑定存管账户-->
		<p class="deleteBtn" v-if="cardData.showDeleteBtn" @click="clickUnBind">删除</p>

		<mt-popup class="bottomModal" v-model="showModal" position="bottom" :closeOnClickModal="false">
			<div class="modalTittle">
				<span class="cancel" @click="cancelModal">取消</span>
				<p class="tittle">更改首选还款账户</p>
				<span class="ensure" @click="ensureModal">确定</span>
			</div>
			<div style="overflow:scroll; height: 270px;">
				<div class="content" v-for="(card, index) in cardData.bindList" :key="'card_' + index" @click="selectCell(index)">
					<bank-card-cell :item="card" :index="index" :canSelected="true" :isSelected="selectIndex == index"/>
					<!-- <img class="select" :src="selectImg[index]"> -->
				</div>
			</div>
		</mt-popup>

		<copy-modal
			:showModal="showCopyModal"
			:item="copyItem"
			@onClose="closeCopyModal"
			@onClick="toBindCG(cardData.item)"
		>
		</copy-modal>
	</div>
</template>

<script>
	import bankCardCell from '@/components/iqiyi/bankCard/BankCardCell';
	import { Indicator, Toast, MessageBox, } from 'mint-ui';
	// import Api from '@/api';
	import storage from '@/utils/storage';
	import { copyToClipboard, } from '@/utils/common';
	import allBankList from '@/utils/bankList';
	import copyModal from '@/components/iqiyi/bankCard/copyModal';

	export default {
		name: 'bankCardList',
		data() {
			let params = location.href.split('?')[1];
			let index = params && params.indexOf('index') > -1 ? Number(params.split('index=')[1]) : 0;
			let selectIndex = 0;
			let preUrl = storage.read('preUrl'); // 银行卡详情页面跳转广发后，回跳到银行卡列表页
			return {
				index,
				showModal: false, //是否显示更改首选还款账户的modal
				showCopyModal: false, //是否显示copy弹框
				copyItem: {},					//copy弹框显示的银行卡信息
				selectImg: [],
				selectIndex,
				preUrl,
			};
		},
		// props: ['index'],
		components: {
			'bank-card-cell': bankCardCell,
			'copy-modal': copyModal,
		},
		computed: {
			cardData() {
				let allList = this.getAllList(this.$store.state.bankCard.bankCardList);
				let {item, bindList, bindCGList} = this.getBindList(allList);
				let isFirstAccount = item.order === 1 || item.order === '1' ? true : false;

				// 非默认收款账户，且非连连绑定的卡，如果是首选还款账户，则需要有其他绑定过存管的卡，如果费首选还款账户，则需要有其他绑定过的卡（app或连连）
				let showDeleteBtn = (!item.isdefault)
												 && (!item.isllCard)
												 && (((item.order === 1 || item.order === '1') && bindCGList.length) || (item.order !== 1 && item.order !== '1' && allList.length >= 2));

				// 非连连绑定的卡，且绑定过存管（未绑定过存管，不能设置为首选还款账户），且有其他绑定过app的卡
				let showSwitchBtn = (!item.isllCard) && item.isGFBind && bindList.length;

				let showBindCGBtn = !item.isGFBind;
				return {item, bindList, bindCGList, allList, isFirstAccount, showDeleteBtn, showSwitchBtn, showBindCGBtn,};
			},
		},
		created() {
			// this.$store.dispatch('queryBankCardList');
			// this.$store.commit('COMMON_CONFIG', { // 组件创建的时候，去修改common.js中配置项的状态
			// 	showTabbar: false,   // 不显示tabbar
			// });
		},
		// beforeRouteEnter (to, from, next) {
		// 	// 在渲染该组件的对应路由被 confirm 前调用
		// 	// 不！能！获取组件实例 `this`
		// 	// 因为当守卫执行前，组件实例还没被创建
		// 	let url = location.href;
		// 	let params = url.split('?');
		// 	next(vm => {
		// 		vm.preUrl = params[0];
		// 	});
		// },
		methods: {
			selectCell(i) {
				if (this.selectIndex === i) return;
				this.selectIndex = i;
				// this.selectImg = this.getSelectedImg(this.cardData.bindList);
			},
			continueBind() {
				this.copyItem = this.cardData.item;
				// copyToClipboard(this.cardData.item.cardno);
				this.showCopyTips();
			},
			showCopyTips() {
				this.showCopyModal = true;
			},
			closeCopyModal() {
				this.showCopyModal = false;
			},
			async toBindCG(item) {
				let bankInfo = {
					bankAccno: item.cardno,
					bankAccount: item.bankCode,
					mobile: '',
				};
				let callbackUrl = this.preUrl;
				let addCardInfo = {
					action: 'bindCG',
					bankInfo,
					callbackUrl,
				};
				storage.write('addCardInfo', JSON.stringify(addCardInfo)); // 保存带到填写预留手机号页面的数据
				this.$router.push({ name: 'bankTel', params: { addCardInfo, } });
			},
			clickUnBind() {
				let text = '';
				if ((this.cardData.item.order === 1 || this.cardData.item.order === '1') && this.cardData.bindCGList.length) {
					text = `解绑银行卡后，此账户将不能收款或还款。 \n ${this.cardData.bindCGList[0].bankname}（尾号${this.cardData.bindCGList[0].cardno.substr(-4, 4)}）将被设为首选还款账户`;
				} else {
					text = `解绑银行卡后，此账户将不能收款或还款。`;
				}
				MessageBox.confirm(text, '').then(action => {
					if (action === 'confirm') {
						if (this.cardData.item.isGFBind) { //绑定了存管账户的，跳转广发解绑页面进行解绑操作（先跳转输入银行预留手机页面）
							let callbackUrl = this.preUrl;
							let addCardInfo = {
								action: 'unbind',
								cardNo: this.cardData.item.cardno,
								bankAccount: this.cardData.item.bankCode,
								callbackUrl: callbackUrl,
							}
							storage.write('addCardInfo', JSON.stringify(addCardInfo)); // 保存带到填写预留手机号页面的数据
							this.$router.push({ name: 'bankTel', params: { addCardInfo, } });
						} else {
							this.unBind();
						}
					}
				});
			},
			async unBind() {
				try {
					Indicator.open();
					let callbackUrl = this.preUrl;
					const data = await Api.bankCard.unbind(this.cardData.item.cardno, this.cardData.item.bankCode, callbackUrl);
					Indicator.close();
					if (data.status === 200 && data.result) { // 成功
						// if (this.cardData.item.isGFBind) { //绑定了存管账户的，跳转广发解绑页面进行解绑操作
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
			async unBindCG() {
				try {
					Indicator.open();
					let bankInfo = {
						bankAccno: this.cardData.item.cardno,
						bankAccount: this.cardData.item.bankCode,
						mobile: '',
					};
					let callbackUrl = this.preUrl;
					const data = await Api.bankCard.getUnlockBankCardHttpRequestUrl(bankInfo, callbackUrl);
					Indicator.close();
					if (data.status === 200 && data.result) { // 成功
						location.href = data.result;
					} else {  // 失败
						let desc = data.desc ? data.desc : '没有获取到第三方解绑链接';
						Toast(desc);
					}
				} catch (error) {
					Indicator.close();
					Toast(error);
					console.log(error);
				}
			},
			async changeFirstAccount() {
				try {
					Indicator.open();
					let card_no = this.cardData.bindList[this.selectIndex].cardno;
					const data = await Api.bankCard.setRepayOrder(card_no);
					Indicator.close();
					if (data.status === 200) { // 成功
						this.showModal = false;
						Toast('更改成功！');
						this.$store.dispatch('queryBankCardList');
					} else {  // 失败
						let desc = data.desc ? data.desc : '操作失败！';
						Toast(desc);
						this.cardData.isFirstAccount = true;
						this.showModal = false;
					}
				} catch (error) {
					Indicator.close();
					this.cardData.isFirstAccount = true;
					this.showModal = false;
					Toast(error);
					console.log(error);
				}
			},
			async setRepayOrder() {
				try {
					Indicator.open();
					const data = await Api.bankCard.setRepayOrder(this.cardData.item.cardno);
					Indicator.close();
					if (data.status === 200) { // 成功
						// Toast('设置成功！');
						this.$store.dispatch('queryBankCardList');
					} else {  // 失败
						let desc = data.desc ? data.desc : '操作失败！';
						Toast(desc);
						this.cardData.isFirstAccount = false;
					}
				} catch (error) {
					Indicator.close();
					this.cardData.isFirstAccount = false;
					Toast(error);
					console.log(error);
				}
			},
			getAllList(_data) {
				let allList = [];
				let resultData = _data;
				if (resultData) {
					if (resultData.LLBindedCard && resultData.LLBindedCard !== {}) {
						let llCard = resultData.LLBindedCard;
						llCard.isllCard = true; //标志为连连支付绑定的卡
						allList.push(llCard);
					}
					if (resultData.BindedCardList && resultData.BindedCardList.length) {
						resultData.BindedCardList.map((obj, i) => {
							allList.push(obj);
						});
					}
				}
				return allList;
			},
			getBindList(allList) {
				let item = {};
				let bindList = [];
				let bindCGList = [];
				allList.map((obj, i) => {
					if (this.index === i) {
						item = obj;
					}
					if (this.index !== i && !obj.isllCard) {
						bindList.push(obj);
					}
					if (this.index !== i && obj.isGFBind && !obj.isllCard) {
						bindCGList.push(obj);
					}
				});
				return {item, bindList, bindCGList};
			},
			onFirstSwitchChange(value) {
				if (value) {
					this.selectIndex = 0;
					this.selectImg = this.getSelectedImg(this.cardData.bindList);
					this.showModal = true;
				} else {
					this.setRepayOrder();
				}
			},
			cancelModal() {
				this.cardData.isFirstAccount = true;
				this.showModal = false;
			},
			ensureModal() {
				let cardItem = this.cardData.bindList[this.selectIndex];
				if (!cardItem.isGFBind) { //未绑定存管账户的，跳转广发解绑页面进行绑定操作
					MessageBox.confirm('该银行卡未绑定存管账户，请先绑定存管账户。').then(action => {
						if (action === 'confirm') {
							this.cancelModal(); //先隐藏更改首选还款账户的modal
							this.copyItem = cardItem;
							copyToClipboard(cardItem.cardno);
							this.showCopyTips();					//显示copy提示框
							// this.toBindCG(cardItem);
						}
					});
				} else {
					this.changeFirstAccount();
				}
			},
			getSelectedImg(bindList) {
				let list = [];
				bindList.map((obj, i) => {
					let img = i === this.selectIndex ? require('@/assets/images/components/bankcard/icon_selected.png') : require('@/assets/images/components/bankcard/icon_unSelect.png');
					list.push(img);
				})
				return list;
			},
		},
		// created() {
		// 	// this.allList = this.getAllList(this.$store.state.bankCard.bankCardList);
		// 	// let {item, bindList, bindCGList} = this.getBindList();
		// 	// this.item = item;
		// 	// this.bindList = bindList;
		// 	// this.bindCGList = bindCGList;
		// 	// this.selectImg = this.getSelectedImg();
		// },
	};
</script>

<style scope lang="scss">
	.container {
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		height: 100%;
	}
	.addBtn {
		margin-bottom: 20px;
	}
	.buttonContainer {
		width: 100%;
		padding: 0 15px;
		.button {
			border-radius: 0.9rem;
			background-color: rgb(54,142,255);
		}
	}
	.unBindtips {
		font-size: 13px;
		color: rgb(117, 117, 117);
		text-align: center;
		margin-top: 20px;
	}
	.deleteBtn {
		position: absolute;
		bottom: 20px;
		font-size: 15px;
		color: rgb(243, 63, 61);
		width: 100%;
		text-align: center;
	}
	.bottomModal {
		width: 100%;
		height: 300px;

		.modalTittle {
			display: flex;
			justify-content: row;
			justify-content: space-between;
			align-items: center;
			height: 0.45rem;
			border-bottom: 0.5px solid rgb(231, 231, 231);
			.cancel {
				font-size: 0.15rem;
				color: rgb(54, 142, 255);
				margin-left: 0.15rem;
			}
			.tittle {
				text-align: center;
				font-size: 0.16rem;
				color: rgb(33, 33, 33);
			}
			.ensure {
				font-size: 0.15rem;
				color: rgb(54, 142, 255);
				margin-right: 0.15rem;
			}
		}
		.content {
			position: relative;

			.select {
				position: absolute;
				right: 0.15rem;
				top: 0.05rem;
			}
		}
		.scroller {
			margin-top: 0.45rem;
		}
	}

	.mint-switch-input:checked + .mint-switch-core {
		border-color: #44db5e;
		background-color: #44db5e;
	}
</style>
