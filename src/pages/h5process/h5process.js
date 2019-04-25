// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import '@/assets/css/reset.css'; // 重置样式表
import '@/assets/styles/common.scss';

import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import router from './router'
import store from '@/store/h5process'
import App from './App';
import vueFilter from '@/utils/filter'; // 格式化
import vueInjecter from '@/utils/inject';

Vue.use(require('vue-wechat-title'));
Vue.use(MintUI);
Vue.use(vueInjecter);
Vue.config.productionTip = false;
vueFilter();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: "<App/>",
  components: { App },
  router,
  store,
  vueInjecter,
});
