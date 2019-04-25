<!--银行卡卡片-->
<template>
	<div class="bankCard">
		<img class="bankCardImg" :class="canSelected && !isSelected ? 'unselected' : ''" :src="carBgImg" width="100%">
		<div class="bankCardContent">
			<div class="bankCardTop" :class="canSelected? '' : 'canot-select'">
				<div class="bankCardInfo" >
					<p class="bankCardName">{{item.bankname}}</p>
					<p class="bankCardType">储蓄卡</p>
				</div>
				<div class="imgList" :class="canSelected?'span_1':'span_0'">
					<img v-for="(imgObj, index) in cardStateImage" :key="'img_' + index" class="bankCardState" :src="imgObj.src" width="82" height="20" />
				</div>
				<img class="select-img" v-if="canSelected" :src="checkCardIcons[isSelected?1:0]" width="19" height="19"/>
			</div>
			<p class="bankCardNum">{{cardno}}</p>
		</div>
	</div>
</template>

<script>
	import allBankList from '@/utils/bankList';

	export default {
		name: 'bankCardCell',
		data() {
			return {
				 checkCardIcons: [
					require('@/assets/images/components/bankcard/icon_unSelect.png'),
					require('@/assets/images/components/bankcard/icon_selected.png')
				],
				// order,          // 1 首选还款账户
				// isdefault,      // true 默认还款账户
				// isGFBind,     // 是否绑定存管 true:已经绑定；false未绑定
			};
		},
		props: {
			item: {
				type: Object,
				default() {
					return {}
				}
			},
			canSelected: {
				type: Boolean,
				default: false
			},
			canSelected: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			carBgImg() {
				let img = allBankList[0].img;
				let bankname = this.item.bankname;
				for (let i = 0; i < allBankList.length; i++) {
					if (bankname === allBankList[i].fullName) {
						img = allBankList[i].img;
						break;
					}
				}
				return img;
			},
			cardStateImage() {
				let imgList = [];
				if (this.item.order === 1 || this.item.order === '1') {
					imgList.push({
						src: require('@/assets/images/components/bankcard/icon_first@2x.png'),
					});
				}
				if (this.item.isdefault) {
					imgList.push({
						src: require('@/assets/images/components/bankcard/icon_default.png'),
					});
				}
				if (!this.item.isGFBind) {
					imgList.push({
						src: require('@/assets/images/components/bankcard/icon_unbind.png'),
					});
				}
				return imgList;
			},
			cardno() {
				return this.item.cardno ? this.item.cardno.substr(-4, 4) : '';
			}
		},
		methods: {
			onClick() {
				this.$emit('onClick', this.item)
			}
		}
	};
</script>

<style scope lang="scss">
	.bankCard {
		position: relative;
		margin: 0.15rem 0.1rem;

		.bankCardImg {
			position: relative;
		}

		.unselected {
			opacity: 0.6;
		}

		.canot-select {
			justify-content: space-between;
		}

		.bankCardContent {
			position: absolute;
			top: 0px;
			left: 0px;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.bankCardTop {
				display: flex;
				flex-direction: row;
				margin: 0.18rem 0.155rem 0.065rem 0.59rem;

				.bankCardInfo {
					display: flex;
					flex-direction: column;
					margin-top: 0.04rem;

					.bankCardName {
						font-size: 0.15rem;
						color: #ffffff;
					}
					.bankCardType {
						font-size: 0.11rem;
						color: #ffffff;
					}
				}
				.imgList {
					display: flex;
					flex-direction: column;
					margin: 0.04rem 0.02rem 0 0.05rem;
				}

				.span_0 {
					flex: 0;
				}

				.span_1 {
					flex: 1;
				}

				.select-img {
					margin-top: 0.04rem;
				}
			}
			.bankCardNum{
				font-family: 'DIN';
				font-size: 0.23rem;
				color: #ffffff;
				margin-right: 0.155rem;
				margin-bottom: 0.35rem;
				text-align: right;
			}

		}
	}
</style>