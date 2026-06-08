<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">XRent</router-link>
      <ul class="navbar-menu">
        <li><router-link to="/cars">Cars</router-link></li>

        <template v-if="authStore.isAuthenticated">
          <li>
            <router-link to="/bookings/me">My Bookings</router-link>
          </li>
          <li v-if="authStore.isAdmin" class="admin-menu-wrapper">
            <button @click="toggleAdminMenu" class="btn-menu">
              Admin ▼
            </button>
            <ul v-if="showAdminMenu" class="admin-submenu">
              <li><router-link to="/admin/cars" @click="closeAdminMenu">Cars</router-link></li>
              <li><router-link to="/admin/bookings" @click="closeAdminMenu">Bookings</router-link></li>
            </ul>
          </li>
          <li>
            <span class="user-info">{{ authStore.user?.fullName }}</span>
          </li>
          <li>
            <button @click="logout" class="btn-logout">Logout</button>
          </li>
        </template>

        <template v-else>
          <li><router-link to="/login">Login</router-link></li>
          <li><router-link to="/register">Register</router-link></li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const showAdminMenu = ref(false)

const toggleAdminMenu = () => {
  showAdminMenu.value = !showAdminMenu.value
}

const closeAdminMenu = () => {
  showAdminMenu.value = false
}

const logout = () => {
  authStore.logout()
  closeAdminMenu()
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

.user-info {
  color: white;
  font-size: 0.9rem;
  opacity: 0.8;
}

.btn-menu {
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s;
  padding: 0;
  font-weight: inherit;
}

.btn-menu:hover {
  color: #aaa;
}

.admin-menu-wrapper {
  position: relative;
}

.admin-submenu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #333;
  list-style: none;
  padding: 0.5rem 0;
  border-radius: 4px;
  min-width: 150px;
  margin-top: 0.5rem;
  z-index: 100;
}

.admin-submenu li {
  padding: 0;
}

.admin-submenu a {
  display: block;
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
}

.admin-submenu a:hover {
  background-color: #444;
  color: white;
}

.btn-logout {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: inherit;
}

.btn-logout:hover {
  background-color: #b71c1c;
}
</style>
