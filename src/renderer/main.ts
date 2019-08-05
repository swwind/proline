import Vue from 'vue';

import App from './App.vue';
import router from './router';
import VueElectron from 'vue-electron';

import { main } from './backend';
import { ipcRenderer } from 'electron';
const { Config, Peers, Files } = main;

Vue.use(VueElectron);

new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app');

document.addEventListener('dragover', (event) => event.preventDefault(), false);
document.addEventListener('drop', (event) => event.preventDefault(), false);

// FIXME: FUNCTION IS NOT SUPPORT
const updateSettingPeers = (config) => {
  Peers.updatePeers('SETTING', config.expeer.split(/\s/g).filter(Boolean));
};
Config.handleUpdate(updateSettingPeers);
updateSettingPeers(Config.getConfig());

ipcRenderer.on('exit', async () => {
  await Files.pauseAllDownloads();
  ipcRenderer.send('finish-exit');
});
