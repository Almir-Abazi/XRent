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

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
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
      useNotificationStore().error('The requested resource was not found.')
    } else if (!error.response) {
      useNotificationStore().error('Network error. Please check your connection.')
    }

    return Promise.reject(error)
  }
)

export default http
