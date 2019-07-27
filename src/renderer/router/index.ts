import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    component: require('@/components/MainPage').default
  }, {
    path: '/subscribe-chan',
    component: require('@/components/SubscribeChannel').default
  }, {
    path: '/chan/:cid',
    component: require('@/components/ChannelPage').default
  }, {
    path: '/post/:cid/:pid',
    component: require('@/components/PostPage').default
  }, {
    path: '/download',
    component: require('@/components/Download').default
  }, {
    path: '/file/:cid/:fid',
    component: require('@/components/FilePage').default
  }, {
    path: '/publish',
    component: require('@/components/publish/Home').default
  }, {
    path: '/create-chan',
    component: require('@/components/publish/Create').default
  }, {
    path: '/write-post',
    component: require('@/components/publish/WritePost').default
  }, {
    path: '/settings',
    component: require('@/components/Settings').default
  }, {
    path: '*',
    redirect: '/'
  }]
});
