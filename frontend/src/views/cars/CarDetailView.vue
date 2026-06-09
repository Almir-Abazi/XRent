<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <router-link
      to="/cars"
      class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 mb-6 transition-colors duration-200"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Cars
    </router-link>

    <div v-if="carStore.loading" class="flex items-center justify-center py-20">
      <svg class="w-8 h-8 animate-spin text-red-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span class="ml-3 text-gray-500">Loading car...</span>
    </div>

    <div v-else-if="carStore.error" class="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
      {{ carStore.error }}
    </div>

    <div v-else-if="carStore.currentCar" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ carStore.currentCar.make }} {{ carStore.currentCar.model }}
          </h1>
          <p class="text-gray-400 text-sm mt-0.5">{{ carStore.currentCar.year }}</p>
        </div>
        <span
          :class="[
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
            carStore.currentCar.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
          ]"
        >
          <span class="w-2 h-2 rounded-full mr-2" :class="carStore.currentCar.available ? 'bg-green-500' : 'bg-red-400'"></span>
          {{ carStore.currentCar.available ? 'Available' : 'Unavailable' }}
        </span>
      </div>

      <div class="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 border-b border-gray-100">
        <div class="text-center">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">License Plate</p>
          <p class="font-semibold text-gray-900">{{ carStore.currentCar.licensePlate }}</p>
        </div>
        <div class="text-center">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Year</p>
          <p class="font-semibold text-gray-900">{{ carStore.currentCar.year }}</p>
        </div>
        <div class="text-center">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Daily Price</p>
          <p class="font-semibold text-red-600 text-lg">${{ carStore.currentCar.dailyPrice }}</p>
        </div>
        <div class="text-center">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Listed</p>
          <p class="font-semibold text-gray-900">{{ formatDate(carStore.currentCar.createdAt) }}</p>
        </div>
      </div>

      <div class="p-6">
        <BookingForm :car="carStore.currentCar" @booking-created="onBookingCreated" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCarStore } from '../../stores/car'
import BookingForm from '../../components/bookings/BookingForm.vue'

const route = useRoute()
const router = useRouter()
const carStore = useCarStore()

const formatDate = (d) => new Date(d).toLocaleDateString()
const onBookingCreated = () => router.push({ name: 'myBookings' })

onMounted(() => carStore.fetchCarById(route.params.id))
</script>
