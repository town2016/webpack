<!--业务授权-->
<template>
	<div class="container">
		<div class="row tittle">
			<span>授权类型</span>
			<span @click="showAmountAlert">授权金额<img :src="require('@/assets/images/components/authorization/arrow_right.png')"></span>
			<span @click="changeDate">授权终止日<img :src="require('@/assets/images/components/authorization/arrow_right.png')"></span>
		</div>
		<div class="row value" v-for="(type, index) in typeList" :type="type" :key="'item' + index">
			<span>{{type}}</span>
			<span>{{'¥' + Number(authorizationData.amount / 100).toFixed(2)}}</span>
			<span>{{showDate}}</span>
		</div>

		<!--修改金额弹窗-->
		<mt-popup
			v-model="popupVisible"
			popup-transition="popup-fade"
			:modal="true"
		>
			<div class="inputAlert">
				<p class="alertTittle">授权金额</p>
				<p class="alertTips">修改授权金额将会影响借款、还款等操作</p>
				<div class="alertInput">
					<input type="number" name="amount" :value="amount" @input="changeInput">
					<span>元</span>
				</div>
				<p class="alertErrorTips">{{alertErrorTips}}</p>
				<div class="alertBtn">
					<p class="alertBtn1" @click="alertCancel"><span>取消</span></p>
					<p class="alertBtn2" @click="changeAmount"><span>确定</span></p>
				</div>
			</div>
		</mt-popup>

		<!--日期选择piker-->
		<mt-datetime-picker
			v-model="pickerVisible"
			type="date"
			ref="picker"
			year-format="{value} 年"
			month-format="{value} 月"
			date-format="{value} 日"
			:startDate="startDate"
			:endDate="endDate"
			@confirm="pickerConfirm"
		>
		</mt-datetime-picker>
	</div>
</template>

<script>
	import { MessageBox } from 'mint-ui';
	import { mapGetters } from 'vuex';
	import moment from 'moment';

	export default {
		name: 'authorization',
		data() {
			return {
				typeList: ['缴费', '放款', '还款'],
				pickerVisible: '',
				popupVisible: false,
				startDate: this.getStartDate(),
				endDate: this.getDate('2022-12-31'),
				alertErrorTips: '',
				amount: Number(this.$store.state.bankCard.authorizationData.amount / 100),
			};
		},
		computed: {
			...mapGetters({
				authorizationData: 'authorizationData', // 授权信息
			}),
			showDate() {
				return moment(this.$store.state.bankCard.authorizationData.date).format('YYYY-MM-DD');
			},
			// amount() {
			// 	return Number(this.$store.state.bankCard.authorizationData.amount / 100);
			// }
		},
		components: {
		},
		methods: {
			showAmountAlert() {
				this.popupVisible = true;
			},
			alertCancel() {
				this.popupVisible = false;
			},
			changeInput(e) {
				this.amount = e.target.value;
			},
			changeAmount() {
				if (Number(this.amount) < 200000) {
					this.alertErrorTips = '授权金额不得低于200000元';
					return;
				}
				if (Number(this.amount) > 100000000) {
					this.alertErrorTips = '授权金额不得高于100000000元';
					return;
				}
				let obj = {
					amount: Number(this.amount) * 100,
					date: this.authorizationData.date,
				}
				this.$store.commit('CHANGE_AUTHORIZATION_AMOUNT', obj);
				this.popupVisible = false;
			},
			changeDate() {
				MessageBox.alert('修改授权终止日将会影响借款、还款等操作', '', {
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: true,
				}).then(action => {
					if (action === 'confirm') {
						this.$refs.picker.open();
					}
				});
			},
			handleConfirm(date) {

			},
			getStartDate() {
				let nowDate = new Date();
				let year = nowDate.getFullYear() + 1;
				nowDate.setFullYear(year);
				return nowDate;
			},
			getDate(value) {
				let nowDate = new Date();
				let year = value ? Number(moment(value).format('YYYY')) : nowDate.getFullYear() + 1;   
				let month = value ? Number(moment(value).format('MM') - 1) : nowDate.getMonth();   
				let date = value ? Number(moment(value).format('DD')) : nowDate.getDate();

				nowDate.setFullYear(year, month, date);
				return nowDate;
			},
			pickerConfirm(value) {
				let obj = {
					amount: this.authorizationData.amount,
					date: moment(value).format('YYYYMMDD'),
				}
				this.$store.commit('CHANGE_AUTHORIZATION_DATE', obj);
			}
		},
		created() {
			this.$store.commit('COMMON_CONFIG', { // 组件创建的时候，去修改common.js中配置项的状态
				showTabbar: false,   // 不显示tabbar
			});
		},
	};
</script>

<style scope lang="scss">
	.container {
		width: 100%;
	}
	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 0.45rem;
		background-color: #ffffff;
		margin-top: 0.5px;

		span {
			display: flex;
			flex: 1;
			justify-content: center;
		}
	}
	.tittle {
		font-size: 0.15rem;
		color: rgb(33, 33, 33);
		margin-top: 0.18rem;
	}
	.value {
		font-size: 0.13rem;
		color: rgb(33, 33, 33);
	}
	.inputAlert {
		border-radius: 10px;
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		align-items: center;

		.alertTittle {
			font-size: 0.16rem;
			color: rbg(33, 33, 33);
			margin-top: 0.2rem;
		}
		.alertTips {
			font-size: 0.13rem;
			color: rgb(243, 63, 61);
			margin: 0.15rem;			
		}
		.alertInput {
			display: flex;
			flex-direction: row;
			align-items: center;
			margin: 0 0.15rem;

			input {
				height: 0.31rem;
				font-size: 0.16rem;
				color: rgb(33, 33, 33);
			}
			span {
				font-size: 0.16rem;
				color: rgb(33, 33, 33);
			}
		}
		.alertErrorTips {
			font-size: 0.12rem;
			color: rgb(243, 63, 61);
			margin: 0.15rem;
		}
		.alertBtn {
			display: flex;
			width: 100%;
			flex-direction: row;
			border-top: 0.5px solid rgb(219, 219, 219);
			height: 0.45rem;

			p {
				display: flex;
				flex: 1;
				justify-content: center;
				text-align: center;
				font-size: 0.16rem;
				color: rgb(117, 117, 117);

				span {
					line-height: 0.45rem;
				}
			}
			.alertBtn2 {
				color: rgb(54, 142, 255);
				border-left: 0.5px solid rgb(219, 219, 219); 
			}
		}
	}
</style>