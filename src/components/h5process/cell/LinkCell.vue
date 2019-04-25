<!--cell-->
<template>
	<a class="link_cell" :href="href">
		<slot name="left"></slot>
		<span class="title">{{title}}</span>
		<p :style="{ fontSize: 15, color: placeholderClass, }"><span>{{valueText}}</span></p>
		<img v-if="isLink" class="rightImg" :src="require('@/assets/images/common/linkCellArrowRight@2x.png')" width="7" height="12">
	</a>
</template>

<script>
	export default {
		name: 'LinkCell',
		data() {
			return {
			};
		},
		props: {
			title: String,
			value: String,
			isLink: null,
			to: Object,
			placeholder: String,
		},
		computed: {
			href() {
				if (this.to && !this.added && this.$router) {
					const resolved = this.$router.match(this.to);
					if (!resolved.matched.length) return this.to;

					this.$nextTick(() => {
						this.added = true;
						this.$el.addEventListener('click', this.handleClick);
					});
					return resolved.fullPath || resolved.path;
				}
				return this.to;
			},
			valueText() {
				let placeholder = this.placeholder ? this.placeholder : '';
				let text = this.value ? this.value : placeholder;
				return text;
			},
			placeholderClass() {
				return this.value ? 'rgb(33, 33, 33)' : 'rgb(193, 193, 193)';
			},
		},
		methods: {
			handleClick($event) {
				$event.preventDefault();
				this.$router.push(this.href);
			}
		}
};
</script>

<style scope lang="scss">
	.link_cell {
		height: 0.45rem;
		display: flex;
		flex: 1;
		flex-direction: row;
		align-items: center;
		background-color: #ffffff;

		.title {
			font-size: 15px;
			color: #000000;
			margin-left: 0.1rem;
			flex: 1;
		}
		.value {
			font-size: 15px;
			color: rgb(33, 33, 33);
		}
		.placeholder{
			font-size: 15px;
			color: rgb(193, 193, 193);
		}
		.rightImg {
			margin-left: 0.1rem;
		}
	}
</style>
