<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Our Fleet</h1>
        <p class="text-gray-500 text-sm mt-0.5">Browse and book your perfect car</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="setFilter(null)"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
            filterAvailable === null
              ? 'bg-black text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
          ]"
        >
          All
        </button>
        <button
          @click="setFilter(true)"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
            filterAvailable === true
              ? 'bg-green-600 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-600'
          ]"
        >
          Available
        </button>
        <button
          @click="setFilter(false)"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
            filterAvailable === false
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
          ]"
        >
          Unavailable
        </button>
      </div>
    </div>

    <div v-if="carStore.loading" class="flex items-center justify-center py-20">
      <svg class="w-8 h-8 animate-spin text-red-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span class="ml-3 text-gray-500">Loading cars...</span>
    </div>

    <div v-else-if="carStore.error" class="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
      {{ carStore.error }}
    </div>

    <div v-else-if="carStore.cars.length === 0" class="text-center py-20">
      <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM3 6h3l3-4h7l3 4" />
        </svg>
      </div>
      <p class="text-gray-500">No cars found matching your filter.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      <CarCard v-for="car in carStore.cars" :key="car.id" :car="car" />
    </div>

    <div v-if="carStore.cars.length > 0" class="flex items-center justify-center gap-4 mt-4">
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        :disabled="!carStore.hasPrevPage"
        @click="carStore.prevPage"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>
      <span class="text-sm text-gray-500">
        Page <strong class="text-gray-900">{{ carStore.currentPage + 1 }}</strong> of {{ carStore.totalPages }}
      </span>
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        :disabled="!carStore.hasNextPage"
        @click="carStore.nextPage"
      >
        Next
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useCarStore } from '../../stores/car'
import CarCard from '../../components/cars/CarCard.vue'

const carStore = useCarStore()
const filterAvailable = computed(() => carStore.filterAvailable)

const setFilter = (available) => carStore.fetchCars(0, available)

onMounted(() => {
  if (carStore.cars.length === 0) carStore.fetchCars(0, null)
})
</script>
