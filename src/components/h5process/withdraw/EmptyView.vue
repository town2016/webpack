<template>
  <div class="empty-page" @click="_click">
		<img class="empty-icon" :src="icon">
		<p class="empty-label">{{ label }}</p>
  </div>
</template>
<script>
export default {
  name: 'EmptyView', // 空的页面
  props: {
		icon: {
			type: String,
			default: require('@/assets/images/withdraw/icon_drawing_empty.png')
		},
		label: {
			type: String,
			default: '暂无数据'
		}
  },
  data () {
    return {
    };
  },
  components: {
	},
  methods: {
      _click () {
          // 页面点击
          this.$emit('click');
      }
  },
}
</script>
<style scoped lang="scss">
.empty-page {
    width: 100%;
    height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;

		.empty-icon {
			width: 1.63rem;
			height: auto;
			margin-top: 1.74rem;
		}

		.empty-label {
			color: #757575;
			font-size: .14rem;
			margin: 0.21rem 0.16rem;
			text-align: center;
		}
}
</style>