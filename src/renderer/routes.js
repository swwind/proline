import UnderConstruction from './page/UnderConstruction.vue';
import Welcome from './page/Welcome.vue';
import Overview from './page/Overview.vue';
import MainView from './page/MainView.vue';

const routes = [
  {
    name: 'index',
    path: '/',
    component: Welcome,
  }, {
    name: 'main-view',
    path: '/app',
    component: MainView,
    children: [
      {
        path: 'overview',
        component: Overview
      }, {
        path: '*',
        component: UnderConstruction
      }
    ]
  }, {
    name: 'under-construction',
    path: '*',
    component: UnderConstruction
  }
];

export default routes;
