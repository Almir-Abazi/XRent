<template>
  <div class="w-full bg-black text-white px-6 py-20 flex flex-col items-center mb-0">
    <div class="w-full max-w-2xl text-center">
      <h1 class="text-5xl sm:text-6xl font-extrabold mb-4 tracking-tight">
        Drive More.<br />
        <span class="text-red-500">Pay Less.</span>
      </h1>
      <p class="text-zinc-400 text-lg mb-10 max-w-md mx-auto">
        Premium car rental — book your ride in minutes, no hidden fees.
      </p>

      <div v-if="authStore.isAuthenticated" class="flex flex-col items-center gap-4">
        <p class="text-zinc-300 text-base">
          Welcome back, <strong class="text-white">{{ authStore.user?.fullName }}</strong>!
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <router-link
            to="/cars"
            class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-red-900/40"
          >
            Browse Cars
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
          <router-link
            to="/bookings/me"
            class="inline-flex items-center gap-2 border border-zinc-600 hover:border-white text-zinc-300 hover:text-white px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200"
          >
            My Bookings
          </router-link>
        </div>
      </div>

      <div v-else class="flex flex-col items-center gap-4">
        <div class="flex flex-wrap justify-center gap-3">
          <router-link
            to="/cars"
            class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-red-900/40"
          >
            Browse Cars
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
          <router-link
            to="/register"
            class="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 shadow-sm"
          >
            Create Account
          </router-link>
        </div>
        <p class="text-zinc-500 text-sm mt-1">
          Already have an account?
          <router-link to="/login" class="text-red-400 hover:text-red-300 font-medium">Log in here</router-link>
        </p>
      </div>
    </div>
  </div>

  <div class="max-w-5xl mx-auto px-6 py-12">
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
      <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="font-semibold text-gray-900 mb-1">Quick Booking</h3>
      <p class="text-gray-500 text-sm">Book your car in under 2 minutes, any time of day.</p>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
      <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <h3 class="font-semibold text-gray-900 mb-1">Safe & Secure</h3>
      <p class="text-gray-500 text-sm">All cars are insured and regularly maintained.</p>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
      <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="font-semibold text-gray-900 mb-1">Best Prices</h3>
      <p class="text-gray-500 text-sm">Transparent daily rates with no hidden costs.</p>
    </div>
  </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
</script>
