import Vue from 'vue';
import Router from 'vue-router';
import Ping from '@/components/Ping';
import Polls from '@/components/Polls';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Polls',
      component: Polls,
    },
    {
      path: '/ping',
      name: 'Ping',
      component: Ping,
    },
  ],
});
