<template>
<div class="card-info" @click="_click">
  <img :src="logo" width="48" height="48" alt="logo"/>
  <div class="m-l-15 span-1">
    <p class="fc-75 fz-px-13">{{ name || ''}}</p>
    <p class="fc-21 fz-px-16">尾号{{ afterNo || ''}}储蓄卡</p>
  </div>
  <!-- <img :src="require('@/assets/images/withdraw/arrow-right.png')" width="18" height="18"> -->
</div>
</template>
<script>
export default {
  name: "BankCardPael",
  props: ['logo', 'name', 'afterNo'],
  data () {
    return {
    }
  },
  methods: {
    _click() {
      this.$emit('click');
    }
  }
}
</script>
<style lang="scss" scoped>
.card-info {
  background: white;
  display: flex;
  align-items: center;
  padding: pxToRem(16);
}
</style>
