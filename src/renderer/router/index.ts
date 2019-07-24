import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'main-page',
    component: require('@/components/MainPage').default
  }, {
    path: '/subscribe-chan',
    name: 'subscribe-chan',
    component: require('@/components/SubscribeChannel').default
  }, {
    path: '/chan/:cid',
    name: 'chan-page',
    component: require('@/components/ChannelPage').default
  }, {
    path: '/post/:cid/:pid',
    name: 'post-page',
    component: require('@/components/PostPage').default
  }, {
    path: '/download',
    name: 'download-page',
    component: require('@/components/Download').default
  }, {
    path: '/down/:cid/:fid',
    name: 'file-page',
    component: require('@/components/FilePage').default
  }, {
    path: '/publish',
    name: 'publish-home',
    component: require('@/components/publish/Home').default
  }, {
    path: '/create-chan',
    name: 'create-chan',
    component: require('@/components/publish/Create').default
  }, {
    path: '*',
    redirect: '/'
  }]
});
