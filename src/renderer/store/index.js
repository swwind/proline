import Vue from 'vue';
import Vuex from 'vuex';

import * as modules from './modules';
import * as actions from './actions';
import * as getters from './getters';

Vue.use(Vuex);

/**
 * @typedef {import('./modules/index').State} State
 * @typedef {import('vuex').Store<State>} Store
 * @type {Store}
 */
const store = new Vuex.Store({
  modules,
  actions,
  getters,
  strict: process.env.NODE_ENV !== 'production'
});

export default store;

// store hot reload
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept([
    './modules',
    './actions',
    './getters'
  ], () => {
    store.hotUpdate({
      modules: require('./modules'),
      actions: require('./actions'),
      getters: require('./getters')
    });
  });
}
