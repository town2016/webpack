// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import '@/assets/css/reset.css'; // 重置样式表
import '@/assets/styles/common.scss';

import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import router from './router'
import store from '@/store/iqiyi'
import App from './App';
import vueInjecter from '@/utils/inject';

Vue.use(require('vue-wechat-title'));
Vue.use(MintUI);
Vue.use(vueInjecter);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: "<App/>",
  components: { App },
  router,
  store,
  vueInjecter,
});
