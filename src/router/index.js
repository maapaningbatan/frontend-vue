import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Auth/Login.vue'
import Register from '@/views/Auth/Register.vue'
import Dashboard from '@/views/Dashboard.vue'
import Settings from '@/views/settings/Settings.vue'
import PositionView from '@/views/Library/Position/PositionIndex.vue'
import OfficeView from '@/views/Library/Office/OfficeIndex.vue'
import DeliveryView from '@/views/Supply/Delivery/DeliveryIndex.vue'
import DeliveryAdd from '@/views/Supply/Delivery/DeliveryAdd.vue'
import Auth from '@/views/Auth/Auth.vue'
import DeliveryEdit from '@/views/Supply/Delivery/DeliveryEdit.vue'
import UserAccountIndex from '@/views/Library/UserAccount/UserAccountIndex.vue'

const routes = [
  // Default → redirect to /login
  { path: '/', redirect: '/login' },

  // Auth wrapper (nested)
  {
    path: "/auth",
    component: Auth,
    children: [
      { path: "", redirect: "/auth/login" }, 
      { path: "login", name: "AuthLogin", component: Login },
      { path: "register", name: "AuthRegister", component: Register }
    ]
  },

  // Top-level login/register but still using Auth.vue
  { path: "/login", component: Auth, children: [{ path: "", component: Login }] },
  { path: "/register", component: Auth, children: [{ path: "", component: Register }] },

  // Dashboard route
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },

  // Settings, Library, Delivery
  { path: '/settings', name: 'settings', component: Settings },
  { path: '/library/position', component: PositionView, name: 'Position' },
  { path: '/library/office', component: OfficeView, name: 'Office' },
  { path: '/library/UserAccount', component: UserAccountIndex, name: 'UserAccount' },
  { path: '/delivery', component: DeliveryView, name: 'Delivery' },
  { path: '/delivery/add', component: DeliveryAdd, name: 'DeliveryAdd' },
  {
    path: '/delivery/edit/:id',
    name: 'DeliveryEdit',
    component: DeliveryEdit,
    props: true  // <-- allows `id` param to be passed as a prop
  },

  // Catch-all → redirect to login
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
