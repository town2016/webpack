<template>
  <div style="width: 100%; height: 100%;">
    <iframe :src="href" frameborder="0" style="width: 100%; height: 100%;"></iframe>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        href: this.$route.query.href || this.$route.query.contractUrl,
      };
    },
    created() {
      
    },
  };
</script>
<style scoped>

</style>
