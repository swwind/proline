import Vue from 'vue';
import Router from 'vue-router';

import routes from './routes';
import store from './store';

import App from './App.vue';

Vue.use(Router);

const router = new Router({ routes });

const app = new Vue({
  store,
  router,
  extends: App
});


const el = document.createElement('div');
document.body.appendChild(el);
app.$mount(el);
