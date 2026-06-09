<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manage Cars</h1>
        <p class="text-gray-500 text-sm mt-0.5">Add, edit, or remove cars from the fleet</p>
      </div>
      <router-link
        to="/admin/cars-form"
        class="inline-flex items-center gap-2 bg-black hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Car
      </router-link>
    </div>

    <div v-if="carStore.loading" class="flex items-center justify-center py-20">
      <svg class="w-8 h-8 animate-spin text-red-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span class="ml-3 text-gray-500">Loading...</span>
    </div>

    <div v-else-if="carStore.error" class="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
      {{ carStore.error }}
    </div>

    <div v-else-if="carStore.cars.length === 0" class="text-center py-20 text-gray-500">
      No cars in the fleet yet.
    </div>

    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Car</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plate</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Daily Price</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-5 py-3.5"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="car in carStore.cars" :key="car.id" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="px-5 py-4 font-medium text-gray-900">{{ car.make }} {{ car.model }}</td>
            <td class="px-5 py-4 text-gray-600">{{ car.year }}</td>
            <td class="px-5 py-4 text-gray-600 font-mono text-xs">{{ car.licensePlate }}</td>
            <td class="px-5 py-4 font-semibold text-gray-900">${{ car.dailyPrice }}</td>
            <td class="px-5 py-4">
              <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', car.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']">
                <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="car.available ? 'bg-green-500' : 'bg-red-400'"></span>
                {{ car.available ? 'Available' : 'Unavailable' }}
              </span>
            </td>
            <td class="px-5 py-4 text-right">
              <div class="flex justify-end gap-2">
                <router-link
                  :to="`/admin/cars-form?id=${car.id}`"
                  class="text-xs bg-gray-100 hover:bg-black hover:text-white text-gray-700 px-3 py-1.5 rounded-lg transition-all duration-200"
                >
                  Edit
                </router-link>
                <button
                  @click="deleteCar(car.id)"
                  class="text-xs bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-3 py-1.5 rounded-lg transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="carStore.cars.length > 0" class="flex items-center justify-center gap-4 mt-5">
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
import { onMounted } from 'vue'
import { useCarStore } from '../../stores/car'

const carStore = useCarStore()

const deleteCar = async (id) => {
  if (confirm('Are you sure you want to delete this car?')) {
    await carStore.deleteCar(id)
  }
}

onMounted(() => carStore.fetchCars(0, null))
</script>
