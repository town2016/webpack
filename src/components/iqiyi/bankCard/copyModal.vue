<!--copy弹框提示-->
<template>
	<mt-popup class="modal" v-model="showModal" :closeOnClickModal="false">
		<img class="modalTopImg" :src="require('@/assets/images/components/pop/bindCG@2x.png')" width="163" height="163">
		<div class="modalContent">
			<img class="modalClose" @click="closeCopyModal" :src="require('@/assets/images/components/pop/close@2x.png')" width="22" height="22">
			<p class="modalTittle">绑定存管账户</p>
			<p class="modalTips">跳转银行存管页面后请绑定此卡信息（已自动复制卡号）</p>
			<div class="modalBank">
				<img :src="bankIconImgUrl">
				<div class="modalBankContent">
					<p class="modalBankText">{{item.bankname}}</p>
					<p class="modalBankText">{{item.cardno}}</p>
				</div>
			</div>
			<mt-button
        class="button"
        type="primary"
        v-clipboard:copy="item.cardno"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        :disabled="false"
        @click.native="clickBtn"
        >立即绑定</mt-button>
		</div>
	</mt-popup>
</template>

<script>
	import allBankList from '@/utils/bankList';

	export default {
		name: 'CopyModal',
		data() {
			return {
			};
		},
		props: ['item', 'showModal',],
		computed: {
			bankIconImgUrl() {
				let img = allBankList[0].icon;
				for (let i = 0; i < allBankList.length; i++) {
					if (this.item.bankCode === allBankList[i].code) {
						img = allBankList[i].icon;
						break;
					}
				}
				return img;
			},
		},
		methods: {
			closeCopyModal() {
				this.$emit('onClose');
			},
			clickBtn() {
				this.$emit('onClick');
      },
      onCopy () {
        console.log('拷贝成功');
      },
      onError () {
        console.log('拷贝失败');
      }
		},
	};
</script>

<style scope lang="scss">
	.modal {
		width: 100%;
		height: 100%;
		background-color: transparent;
		display: flex;
		flex-direction: column;
		// justify-content: center;
		align-items: center;

		.modalTopImg {
			margin-top: 0.56rem;
			z-index: 99;
		}
		.modalContent {
			position: relative;
			background-color: #ffffff;
			width: 2.77rem;
			height: 3.20rem;
			border-radius: 5px;
			margin-top: -50px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			padding-bottom: 0.20rem;
			.modalClose {
				position: absolute;
				right: 0.10rem;
				top: 0.10rem;
			}
			.modalTittle {
				font-size: 0.16rem;
				color: #212121;
				margin: 0.27rem 0 0.21rem;
			}
			.modalTips {
				font-size: 0.14rem;
				color: #F33F3D;
				margin: 0 0.38rem 0.20rem;
				line-height: 0.21rem;
			}
			.modalBank {
				display: flex;
				width: 100%;
				align-items: center;
				padding: 0 0.38rem 0.30rem;
			}
			.modalBankContent {
				margin-left: 0.10rem;
			}
			.modalBankText {
				font-size: 0.13rem;
				color: #212121;
				line-height: 0.19rem;
			}
		}
		.button {
			border-radius: 0.9rem;
			background-color: rgb(54,142,255);
			width: 1.55rem;
		}
	}
</style>
