import Vue from 'vue';

import App from './App.vue';
import router from './router';
import VueElectron from 'vue-electron';

Vue.use(VueElectron);
// Vue.config.productionTip = false;

new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app');

document.addEventListener('dragover', (event) => event.preventDefault(), false);
document.addEventListener('drop', (event) => event.preventDefault(), false);
