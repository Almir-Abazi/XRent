import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const roles = ref([])

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => roles.value.includes('ROLE_ADMIN'))

  const setAuth = (newToken, userData) => {
    token.value = newToken
    user.value = userData
    roles.value = userData.roles || []
    localStorage.setItem('token', newToken)
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    roles.value = []
    localStorage.removeItem('token')
  }

  return {
    token,
    user,
    roles,
    isAuthenticated,
    isAdmin,
    setAuth,
    clearAuth
  }
})
