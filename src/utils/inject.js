export const injecter = {
  install(Vue) {
    Vue.prototype.$occurError = function $occurError(err = null, routerPath = null) {
      // if (this._isDestroyed) {
      //   return;
      // } else if (this._inactive) { // 不活跃
      //   this.$clearComponent(this.$options.name); // 清除
      //   return;
      // }
      if (err.status === 302) {
        return; // 302错误忽略
      }
      this.$router.replace('/error/' + encodeURIComponent(routerPath || this.$route.fullPath));
      // if (this._inactive !== null) {
      //   this.$clearComponent(this.$options.name); // 清除
      // }
    };
    // Vue.prototype.$showToast = function() { //注入全局弹窗功能
    //   this.$root.$emit('showModal', { type: 'toast', conf: { text, } });
    // };
    // Vue.mixin({
    //   beforeCreate() {
    //     const servor = this.$options.injecter;
    //     if (servor) { // root
    //       this.$inject = servor;
    //     } else {
    //       this.$clearComponent = this.$root.$clearComponent;
    //     }
    //   },
    // });
  }
};
export default injecter;