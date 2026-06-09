<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
    <div class="p-5">
      <div class="flex items-start justify-between mb-3">
        <div>
          <h3 class="font-semibold text-gray-900 text-lg group-hover:text-red-600 transition-colors duration-200">
            {{ car.make }} {{ car.model }}
          </h3>
          <p class="text-sm text-gray-400">{{ car.year }} · {{ car.licensePlate }}</p>
        </div>
        <span
          :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            car.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
          ]"
        >
          <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="car.available ? 'bg-green-500' : 'bg-red-400'"></span>
          {{ car.available ? 'Available' : 'Unavailable' }}
        </span>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-gray-50">
        <div>
          <span class="text-xl font-bold text-gray-900">${{ car.dailyPrice }}</span>
          <span class="text-sm text-gray-400"> / day</span>
        </div>
        <slot></slot>
      </div>
    </div>

    <div class="px-5 pb-5">
      <router-link
        :to="`/cars/${car.id}`"
        class="block w-full text-center bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-medium py-2 rounded-xl text-sm transition-all duration-200"
      >
        View Details
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  car: { type: Object, required: true }
})
</script>
