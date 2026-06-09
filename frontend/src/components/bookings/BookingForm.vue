<template>
  <div class="mt-6 bg-gray-50 rounded-2xl p-6 border border-gray-100">
    <h3 class="text-lg font-semibold text-gray-900 mb-5">Book This Car</h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
          <input
            id="startDate"
            v-model="form.startDate"
            type="date"
            required
            :disabled="loading"
            @change="calculatePrice"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-shadow"
          />
        </div>
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
          <input
            id="endDate"
            v-model="form.endDate"
            type="date"
            required
            :disabled="loading"
            @change="calculatePrice"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-shadow"
          />
        </div>
      </div>

      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="totalPrice !== null" class="bg-white rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
          <div class="flex justify-between text-gray-600">
            <span>Duration</span>
            <span>{{ dayCount }} {{ dayCount === 1 ? 'day' : 'days' }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Daily rate</span>
            <span>${{ car.dailyPrice }}</span>
          </div>
          <div class="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100 text-base">
            <span>Total</span>
            <span class="text-red-600">${{ totalPrice }}</span>
          </div>
        </div>
      </Transition>

      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div v-if="error" class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ error }}
        </div>
      </Transition>

      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 disabled:bg-gray-300 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
      >
        <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        {{ loading ? 'Booking...' : 'Confirm Booking' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useBookingStore } from '../../stores/booking'
import { useAuthStore } from '../../stores/auth'
import { useNotificationStore } from '../../stores/notification'
import { useRouter } from 'vue-router'

const props = defineProps({ car: { type: Object, required: true } })
const emit = defineEmits(['booking-created'])

const bookingStore = useBookingStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const form = reactive({ startDate: '', endDate: '' })
const error = ref('')
const loading = computed(() => bookingStore.loading)

const dayCount = computed(() => {
  if (!form.startDate || !form.endDate) return 0
  return Math.floor((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))
})

const totalPrice = computed(() =>
  dayCount.value <= 0 ? null : (dayCount.value * props.car.dailyPrice).toFixed(2)
)

const isFormValid = computed(() =>
  form.startDate && form.endDate && dayCount.value > 0
)

const calculatePrice = () => {
  error.value = ''
  if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
    error.value = 'End date must be after start date'
  }
}

const handleSubmit = async () => {
  if (!authStore.isAuthenticated) {
    notificationStore.info('Please log in to book a car.')
    router.push({ name: 'login' })
    return
  }
  error.value = ''
  const success = await bookingStore.createBooking(props.car.id, form.startDate, form.endDate)
  if (success) {
    emit('booking-created')
    form.startDate = ''
    form.endDate = ''
  } else {
    error.value = bookingStore.error
  }
}
</script>
