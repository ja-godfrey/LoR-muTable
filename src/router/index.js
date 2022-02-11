import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
   {
      path: '/',
      name: 'Home',
      component: Home,
   },
   {
      path: '/vault',
      name: 'Vault',
      component: () => import('../views/Vault.vue'),
   },
];

const router = createRouter({
   history: createWebHistory(process.env.BASE_URL),
   routes,
});

export default router;
