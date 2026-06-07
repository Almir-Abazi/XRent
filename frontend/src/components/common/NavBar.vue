<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">XRent</router-link>
      <ul class="navbar-menu">
        <li><router-link to="/cars">Cars</router-link></li>
        <li v-if="authStore.isAuthenticated">
          <router-link to="/bookings/me">My Bookings</router-link>
        </li>
        <li v-if="authStore.isAdmin">
          <router-link to="/admin/cars">Admin</router-link>
        </li>
        <li v-if="!authStore.isAuthenticated">
          <router-link to="/login">Login</router-link>
        </li>
        <li v-if="!authStore.isAuthenticated">
          <router-link to="/register">Register</router-link>
        </li>
        <li v-if="authStore.isAuthenticated">
          <button @click="logout" class="btn-logout">Logout</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.clearAuth()
  router.push({ name: 'home' })
}
</script>

<style scoped>
.navbar {
  background-color: #222;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.navbar-menu {
  list-style: none;
  display: flex;
  gap: 2rem;
  align-items: center;
}

.navbar-menu a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.navbar-menu a:hover {
  color: #aaa;
}

.btn-logout {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-logout:hover {
  background-color: #b71c1c;
}
</style>
