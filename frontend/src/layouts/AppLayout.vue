<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <NavBar />
    <main class="flex-1 w-full">
      <router-view />
    </main>
    <AppFooter />
    <Notification />
  </div>
</template>

<script setup>
import NavBar from '../components/common/NavBar.vue'
import AppFooter from '../components/common/AppFooter.vue'
import Notification from '../components/common/Notification.vue'
</script>
