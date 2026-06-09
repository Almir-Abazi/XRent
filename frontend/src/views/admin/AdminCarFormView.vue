<template>
  <div class="max-w-lg mx-auto px-6 py-10">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ isEdit ? 'Edit Car' : 'Add New Car' }}</h1>
      <p class="text-gray-500 text-sm mt-0.5">{{ isEdit ? 'Update the car details below' : 'Fill in the details to add a car to the fleet' }}</p>
    </div>

    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div v-if="carStore.error" class="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ carStore.error }}
      </div>
    </Transition>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="make" class="block text-sm font-medium text-gray-700 mb-1.5">Make</label>
          <input id="make" v-model="form.make" type="text" placeholder="e.g. Toyota" required :disabled="carStore.loading"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed" />
        </div>
        <div>
          <label for="model" class="block text-sm font-medium text-gray-700 mb-1.5">Model</label>
          <input id="model" v-model="form.model" type="text" placeholder="e.g. Corolla" required :disabled="carStore.loading"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="year" class="block text-sm font-medium text-gray-700 mb-1.5">Year</label>
          <input id="year" v-model.number="form.year" type="number" min="1886" max="2100" required :disabled="carStore.loading"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed" />
        </div>
        <div>
          <label for="dailyPrice" class="block text-sm font-medium text-gray-700 mb-1.5">Daily Price ($)</label>
          <input id="dailyPrice" v-model.number="form.dailyPrice" type="number" min="0.01" step="0.01" required :disabled="carStore.loading"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed" />
        </div>
      </div>

      <div>
        <label for="licensePlate" class="block text-sm font-medium text-gray-700 mb-1.5">License Plate</label>
        <input id="licensePlate" v-model="form.licensePlate" type="text" placeholder="e.g. ABC-123-XYZ" required :disabled="carStore.loading"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed font-mono" />
      </div>

      <div class="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-150">
        <input id="available" v-model="form.available" type="checkbox" :disabled="carStore.loading"
          class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer" />
        <label for="available" class="flex-1 text-sm font-medium text-gray-700 cursor-pointer select-none">Available for booking</label>
        <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', form.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
          {{ form.available ? 'Active' : 'Inactive' }}
        </span>
      </div>

      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="carStore.loading"
          class="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 disabled:bg-gray-300 text-white font-medium py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
        >
          <svg v-if="carStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          {{ carStore.loading ? 'Saving...' : isEdit ? 'Update Car' : 'Add Car' }}
        </button>
        <router-link
          to="/admin/cars"
          class="flex-1 flex items-center justify-center text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 font-medium py-2.5 rounded-xl text-sm transition-all duration-200"
        >
          Cancel
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCarStore } from '../../stores/car'

const route = useRoute()
const router = useRouter()
const carStore = useCarStore()

const isEdit = computed(() => !!route.query.id)
const form = reactive({ make: '', model: '', year: new Date().getFullYear(), licensePlate: '', dailyPrice: 0, available: true })

const handleSubmit = async () => {
  const success = isEdit.value
    ? await carStore.updateCar(route.query.id, form)
    : await carStore.createCar(form)
  if (success) router.push({ name: 'adminCars' })
}

onMounted(async () => {
  if (isEdit.value) {
    await carStore.fetchCarById(route.query.id)
    if (carStore.currentCar) {
      Object.assign(form, {
        make: carStore.currentCar.make,
        model: carStore.currentCar.model,
        year: carStore.currentCar.year,
        licensePlate: carStore.currentCar.licensePlate,
        dailyPrice: carStore.currentCar.dailyPrice,
        available: carStore.currentCar.available
      })
    }
  }
})
</script>
