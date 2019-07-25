import Vue from 'vue';
import axios from 'axios';
import log from 'electron-log';

import App from './App.vue';
import router from './router';
import VueElectron from 'vue-electron';

Vue.use(VueElectron);
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app');

log.log('started');

window.onerror = (e) => {
  log.error(e);
};
