<template>
	<div class="bg-white result-message">
			<img :src="icon" width="70" height="70" alt="success">
			<p class="fc-21 fz-px-18 m-t-10 text-center">{{ message }}</p>
			<p class="fc-75 fz-px-14 m-t-5 text-center">{{ tip }}</p>
	</div>
</template>
<script>
export default {
  name: 'ResultMessage', // 结果信息
  props: ['message', 'tip'],
  props: {
    message: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: require('@/assets/images/common/success.png')
    },
  },
  data () {
    return {
    };
  },
  components: {
  },
  methods: {
  },
}
</script>
<style scoped lang="scss">
.result-message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: pxToRem(190);
}
</style>
