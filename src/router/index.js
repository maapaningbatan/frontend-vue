import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Auth/Login.vue';
import Register from '@/views/Auth/Register.vue';
import Dashboard from '@/views/Dashboard.vue';
import AboutView from '@/views/AboutView.vue';

const routes = [
  // Default route -> redirect to login
  { path: '/', redirect: '/login' },

  // Auth routes
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },

  // Dashboard route
  { 
    path: '/dashboard', 
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },

  // Example additional page
  { path: '/about', name: 'About', component: AboutView },

  // Catch all - redirect unknown routes to login
  { path: '/:pathMatch(.*)*', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard for auth
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
