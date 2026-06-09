<template>
  <nav class="bg-black shadow-lg sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

      <!-- Brand -->
      <router-link
        to="/"
        class="text-white text-xl font-extrabold tracking-tight shrink-0"
      >
        X<span class="text-red-500">Rent</span>
      </router-link>

      <!-- Nav items -->
      <ul class="flex items-center gap-1">
        <li>
          <router-link
            to="/cars"
            class="text-zinc-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Cars
          </router-link>
        </li>

        <template v-if="authStore.isAuthenticated">
          <li>
            <router-link
              to="/bookings/me"
              class="text-zinc-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              My Bookings
            </router-link>
          </li>

          <li v-if="authStore.isAdmin" class="relative" ref="adminMenuRef">
            <button
              @click="toggleAdminMenu"
              class="flex items-center gap-1 text-zinc-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Admin
              <svg
                class="w-3.5 h-3.5 transition-transform duration-200"
                :class="showAdminMenu ? 'rotate-180' : ''"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <ul v-if="showAdminMenu" class="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <li>
                  <router-link to="/admin/cars" @click="closeAdminMenu"
                    class="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors">
                    Manage Cars
                  </router-link>
                </li>
                <li>
                  <router-link to="/admin/bookings" @click="closeAdminMenu"
                    class="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors">
                    All Bookings
                  </router-link>
                </li>
              </ul>
            </Transition>
          </li>

          <li class="flex items-center gap-2 px-2">
            <div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {{ initials }}
            </div>
            <span class="text-zinc-300 text-sm hidden md:block truncate max-w-[120px]">{{ authStore.user?.fullName }}</span>
          </li>

          <li>
            <button
              @click="logout"
              class="text-zinc-400 hover:text-white hover:bg-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Logout
            </button>
          </li>
        </template>

        <template v-else>
          <li>
            <router-link to="/login"
              class="text-zinc-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              Login
            </router-link>
          </li>
          <li>
            <router-link to="/register"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200">
              Sign Up
            </router-link>
          </li>
        </template>
      </ul>

    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const showAdminMenu = ref(false)
const adminMenuRef = ref(null)

const initials = computed(() => {
  const name = authStore.user?.fullName || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const toggleAdminMenu = () => { showAdminMenu.value = !showAdminMenu.value }
const closeAdminMenu = () => { showAdminMenu.value = false }

const handleOutsideClick = (e) => {
  if (adminMenuRef.value && !adminMenuRef.value.contains(e.target)) closeAdminMenu()
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onUnmounted(() => document.removeEventListener('click', handleOutsideClick))

const logout = () => {
  authStore.logout()
  closeAdminMenu()
  router.push({ name: 'home' })
}
</script>
