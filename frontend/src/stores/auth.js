import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService'

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
    error.value = null
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    roles.value = []
    localStorage.removeItem('token')
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

  // Restore session on app load (if token exists in localStorage)
  const restoreSession = () => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      // Token is restored; JWT interceptor will handle re-auth
      // If token is expired, 401 will trigger logout via interceptor
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
