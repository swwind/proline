import Vue from 'vue';
import axios from 'axios';

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
