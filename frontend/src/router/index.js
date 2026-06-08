import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/cars',
    name: 'carList',
    component: () => import('../views/cars/CarListView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/cars/:id',
    name: 'carDetail',
    component: () => import('../views/cars/CarDetailView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/bookings/me',
    name: 'myBookings',
    component: () => import('../views/bookings/MyBookingsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cars',
    name: 'adminCars',
    component: () => import('../views/admin/CarManageView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/cars-form',
    name: 'adminCarForm',
    component: () => import('../views/admin/AdminCarFormView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/bookings',
    name: 'adminBookings',
    component: () => import('../views/admin/AllBookingsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Redirect authenticated users away from login/register pages
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }

  // Protect routes that require authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
    return
  }

  // Protect routes that require admin role
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
