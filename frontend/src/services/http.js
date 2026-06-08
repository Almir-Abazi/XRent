import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import router from '../router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor: attach JWT token
http.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: centralised HTTP error handling
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // Only redirect if the user was previously authenticated (i.e. token expired).
      // A failed login also returns 401 but should not trigger a redirect.
      const authStore = useAuthStore()
      const wasAuthenticated = authStore.isAuthenticated
      authStore.clearAuth()
      if (wasAuthenticated && router.currentRoute.value.name !== 'login') {
        useNotificationStore().info('Your session has expired. Please log in again.')
        router.push({ name: 'login' })
      }
    } else if (status === 403) {
      useNotificationStore().error('You do not have permission to perform this action.')
    } else if (status === 404) {
      // Only show a generic toast when the error is not already handled by a store
      // (stores set their own error.value; the toast adds extra visibility)
      useNotificationStore().error('The requested resource was not found.')
    } else if (!error.response) {
      // Network error — no response from server
      useNotificationStore().error('Network error. Please check your connection.')
    }

    return Promise.reject(error)
  }
)

export default http
