import Vue from 'vue';

import App from './App.vue';
import router from './router';
import VueElectron from 'vue-electron';
import Peers from '../core/peers/Peers';
import * as Config from '../core/posts/Config';

Vue.use(VueElectron);

new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app');

document.addEventListener('dragover', (event) => event.preventDefault(), false);
document.addEventListener('drop', (event) => event.preventDefault(), false);

const updateSettingPeers = (config) => {
  Peers.updatePeers('SETTING', new Set(config.expeer.split(/\s/g).filter(Boolean)));
};
Config.handleUpdate(updateSettingPeers);
updateSettingPeers(Config.getConfig());
