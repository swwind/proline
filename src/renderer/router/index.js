import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-page',
      component: require('@/components/MainPage').default
    },
    {
      path: '/chan/:cid',
      name: 'chan-page',
      component: require('@/components/ChannelPage').default
    },
    {
      path: '/post/:cid/:pubtime',
      name: 'post-page',
      component: require('@/components/PostPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
