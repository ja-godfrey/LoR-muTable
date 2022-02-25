import { createRouter, createWebHistory } from 'vue-router';
import { AuthenticationGuard } from 'vue-auth0-plugin';
import Home from '../views/Home.vue';

const routes = [
   {
      path: '/',
      name: 'Home',
      component: Home,
   },
   {
      path: '/vault/:id?',
      name: 'Vault',
      component: () => import('../views/Vault.vue'),
      beforeEnter: [AuthenticationGuard],
   },
];

const router = createRouter({
   history: createWebHistory(process.env.BASE_URL),
   routes,
});

export default router;
