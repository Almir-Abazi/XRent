<template>
  <div class="booking-form">
    <h3>Book This Car</h3>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="startDate">Start Date</label>
        <input
          id="startDate"
          v-model="form.startDate"
          type="date"
          required
          :disabled="loading"
          @change="calculatePrice"
        />
      </div>

      <div class="form-group">
        <label for="endDate">End Date</label>
        <input
          id="endDate"
          v-model="form.endDate"
          type="date"
          required
          :disabled="loading"
          @change="calculatePrice"
        />
      </div>

      <div v-if="totalPrice !== null" class="price-summary">
        <p><strong>Days:</strong> {{ dayCount }}</p>
        <p><strong>Daily Rate:</strong> ${{ car.dailyPrice }}</p>
        <p class="total"><strong>Total Price:</strong> ${{ totalPrice }}</p>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" class="btn-submit" :disabled="loading || !isFormValid">
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

const props = defineProps({
  car: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['booking-created'])

const bookingStore = useBookingStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const form = reactive({
  startDate: '',
  endDate: ''
})

const error = ref('')
const loading = computed(() => bookingStore.loading)

const dayCount = computed(() => {
  if (!form.startDate || !form.endDate) return 0
  const start = new Date(form.startDate)
  const end = new Date(form.endDate)
  return Math.floor((end - start) / (1000 * 60 * 60 * 24))
})

const totalPrice = computed(() => {
  if (dayCount.value <= 0) return null
  return (dayCount.value * props.car.dailyPrice).toFixed(2)
})

const isFormValid = computed(() => {
  return form.startDate && form.endDate && dayCount.value > 0
})

const calculatePrice = () => {
  error.value = ''
  if (form.startDate && form.endDate) {
    const start = new Date(form.startDate)
    const end = new Date(form.endDate)
    if (end <= start) {
      error.value = 'End date must be after start date'
    }
  }
}

const handleSubmit = async () => {
  if (!authStore.isAuthenticated) {
    notificationStore.info('Please log in to book a car.')
    router.push({ name: 'login' })
    return
  }

  error.value = ''
  const success = await bookingStore.createBooking(
    props.car.id,
    form.startDate,
    form.endDate
  )

  if (success) {
    emit('booking-created')
    form.startDate = ''
    form.endDate = ''
  } else {
    error.value = bookingStore.error
  }
}
</script>

<style scoped>
.booking-form {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.booking-form h3 {
  margin-top: 0;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-group input:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

.price-summary {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.price-summary p {
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
}

.price-summary .total {
  font-size: 1.1rem;
  color: #1976d2;
  border-top: 1px solid #ddd;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background-color: #43a047;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #2e7d32;
}

.btn-submit:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}
</style>
