<template>
  <div class="home">
    <h1>Welcome to XRent</h1>
    <p>Car rental system powered by Spring Boot and Vue 3</p>

    <div v-if="authStore.isAuthenticated" class="authenticated-section">
      <p>Hello, <strong>{{ authStore.user?.fullName }}</strong>!</p>
      <router-link to="/cars" class="btn">Browse Cars</router-link>
      <router-link to="/bookings/me" class="btn btn-secondary">View My Bookings</router-link>
    </div>

    <div v-else class="guest-section">
      <p>Get started by browsing our cars or signing up for an account.</p>
      <router-link to="/cars" class="btn">Browse Cars</router-link>
      <router-link to="/register" class="btn btn-secondary">Create Account</router-link>
      <p class="login-text">
        Already have an account?
        <router-link to="/login">Log in here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.home {
  text-align: center;
  padding: 4rem 0;
}

.home h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.home > p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #666;
}

.authenticated-section,
.guest-section {
  margin-top: 2rem;
}

.authenticated-section p,
.guest-section p {
  margin-bottom: 1.5rem;
  color: #666;
}

.btn {
  display: inline-block;
  background-color: #1976d2;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
  margin: 0 0.5rem;
}

.btn:hover {
  background-color: #1565c0;
}

.btn-secondary {
  background-color: #43a047;
}

.btn-secondary:hover {
  background-color: #2e7d32;
}

.login-text {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.login-text a {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
}

.login-text a:hover {
  text-decoration: underline;
}
</style>
