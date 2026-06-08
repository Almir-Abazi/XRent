import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService'
import { useNotificationStore } from './notification'

const USER_KEY = 'xrent_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const roles = ref([])
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => roles.value.includes('ROLE_ADMIN'))

  const setAuth = (newToken, userData) => {
    token.value = newToken
    user.value = userData
    roles.value = userData.roles || []
    localStorage.setItem('token', newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    error.value = null
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    roles.value = []
    localStorage.removeItem('token')
    localStorage.removeItem(USER_KEY)
    error.value = null
  }

  const register = async (email, password, fullName) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(email, password, fullName)
      setAuth(response.token, {
        email: response.email,
        fullName: response.fullName,
        roles: response.roles
      })
      useNotificationStore().success('Registration successful! Welcome to XRent.')
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(email, password)
      setAuth(response.token, {
        email: response.email,
        fullName: response.fullName,
        roles: response.roles
      })
      useNotificationStore().success(`Welcome back, ${response.fullName}!`)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    clearAuth()
  }

  // Restore session from localStorage on app load.
  // Stores both token AND user info so roles/name survive a page refresh.
  const restoreSession = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem(USER_KEY)
    if (savedToken) {
      token.value = savedToken
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          user.value = userData
          roles.value = userData.roles || []
        } catch {
          // Corrupted user data — clear everything to force re-login
          clearAuth()
        }
      }
    }
  }

  return {
    token,
    user,
    roles,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    register,
    login,
    logout,
    setAuth,
    clearAuth,
    restoreSession
  }
})
