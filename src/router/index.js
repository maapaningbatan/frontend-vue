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
import SupplyList from '@/views/Supply/StockCard/SupplyList.vue'
import StockCard from '@/views/Supply/StockCard/StockCard.vue'
import PropertyIndex from '@/views/Property/PropertyCard/PropertyIndex.vue'
import SemiExIndex from '@/views/Property/SemiExpandable/SemiExIndex.vue'
import SemiExCard from '@/views/Property/SemiExpandable/SemiExCard.vue'
import UserAccountIndex from '@/views/Library/UserAccount/UserAccountIndex.vue'
import PropertyCard from '@/views/Property/PropertyCard/PropertyCard.vue'
import PropertyIssuanceIndex from '@/views/Property/PropertyIssuance/PropertyIssuanceIndex.vue'
import PropertyIssuanceEdit from '@/views/Property/PropertyIssuance/PropertyIssuanceEdit.vue'
import RISIndex from '@/views/Supply/RIS/RISIndex.vue'
import RISAdd from '@/views/Supply/RIS/RISAdd.vue'
import UserLevelIndex from '@/views/AccessControl/UserLevelIndex.vue'
import UserLevelPermissions from '@/views/AccessControl/UserLevelPermissions.vue'


const routes = [
  // Default → redirect to /login
  { path: '/', redirect: '/login' },

  // Auth wrapper (nested)
  {
    path: '/auth',
    component: Auth,
    children: [
      { path: '', redirect: '/auth/login' },
      { path: 'login', name: 'AuthLogin', component: Login },
      { path: 'register', name: 'AuthRegister', component: Register },
    ],
  },

  // Top-level login/register but still using Auth.vue
  { path: '/login', component: Auth, children: [{ path: '', component: Login }] },
  { path: '/register', component: Auth, children: [{ path: '', component: Register }] },

  // Dashboard route
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },

  // Settings, Library,
  { path: '/settings', name: 'settings', component: Settings },
  { path: '/library/position', component: PositionView, name: 'Position' },
  { path: '/library/office', component: OfficeView, name: 'Office' },
  { path: '/library/UserAccount', component: UserAccountIndex, name: 'UserAccount' },
  // Supply
  // Delivery
  { path: '/delivery', component: DeliveryView, name: 'Delivery' },
  { path: '/delivery/add', component: DeliveryAdd, name: 'DeliveryAdd' },
  {
    path: '/delivery/edit/:id',
    name: 'DeliveryEdit',
    component: DeliveryEdit,
    props: true, // <-- allows `id` param to be passed as a prop
  },

  // Stock Card
  { path: '/supplies', component: SupplyList, name: 'SupplyList' },
  { path: '/stock/card/:id', name: 'StockCard', component: StockCard, props: true },
  { path: '/property-card', component: PropertyIndex, name: 'PropertyIndex' },
  { path: '/property-card/:id', component: PropertyCard, name: 'PropertyCard' },

  { path: '/semi-expandable', component: SemiExIndex, name: 'SemiExIndex' },
  { path: '/semi-expandable/:id', component: SemiExCard, name: 'SemiExCard' },

  { path: '/property-issuance', component: PropertyIssuanceIndex, name: 'PropertyIssuanceIndex' },
  {
    path: '/property-issuance/:type/:id/edit',
    component: PropertyIssuanceEdit,
    name: 'PropertyIssuanceEdit',
    props: true,
  },
  { path: '/ris', component: RISIndex, name: 'RISIndex' },
  { path: '/ris/add', component: RISAdd, name: 'RISAdd' },

  // Catch-all → redirect to login
  { path: '/:pathMatch(.*)*', redirect: '/login' },

  {
    path: '/access-control/user-levels',
    name: 'UserLevelIndex',
    component: UserLevelIndex,
    meta: {
      title: 'User Levels',
      requiresAuth: true, // optional if you have auth middleware
    },
  },
{
  path: '/access-control/user-levels/:id/permissions',
  name: 'UserLevelPermissions',
  component: () => import('@/views/AccessControl/UserLevelPermissions.vue'),
  props: true
},
  
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
