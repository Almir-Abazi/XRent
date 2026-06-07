<template>
  <div class="car-detail-container">
    <router-link to="/cars" class="back-link">← Back to Cars</router-link>

    <div v-if="carStore.loading" class="loading">Loading car...</div>

    <div v-else-if="carStore.error" class="error">
      {{ carStore.error }}
    </div>

    <div v-else-if="carStore.currentCar" class="car-detail">
      <div class="car-header">
        <h1>{{ carStore.currentCar.make }} {{ carStore.currentCar.model }}</h1>
        <span :class="['availability', carStore.currentCar.available ? 'available' : 'unavailable']">
          {{ carStore.currentCar.available ? 'Available' : 'Unavailable' }}
        </span>
      </div>

      <div class="car-details">
        <div class="detail-item">
          <strong>Year:</strong>
          <span>{{ carStore.currentCar.year }}</span>
        </div>
        <div class="detail-item">
          <strong>License Plate:</strong>
          <span>{{ carStore.currentCar.licensePlate }}</span>
        </div>
        <div class="detail-item">
          <strong>Daily Price:</strong>
          <span>${{ carStore.currentCar.dailyPrice }}</span>
        </div>
        <div class="detail-item">
          <strong>Created:</strong>
          <span>{{ formatDate(carStore.currentCar.createdAt) }}</span>
        </div>
      </div>

      <BookingForm
        :car="carStore.currentCar"
        @booking-created="onBookingCreated"
      />
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const onBookingCreated = () => {
  // Show success message and redirect
  router.push({ name: 'myBookings' })
}

onMounted(() => {
  carStore.fetchCarById(route.params.id)
})
</script>

<style scoped>
.car-detail-container {
  padding: 1rem 0;
}

.back-link {
  display: inline-block;
  color: #1976d2;
  text-decoration: none;
  margin-bottom: 1.5rem;
  transition: color 0.3s;
}

.back-link:hover {
  color: #1565c0;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
}

.car-detail {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.car-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.car-header h1 {
  margin: 0;
}

.availability {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
}

.availability.available {
  background-color: #c8e6c9;
  color: #2e7d32;
}

.availability.unavailable {
  background-color: #ffcccc;
  color: #c62828;
}

.car-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-item strong {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.detail-item span {
  font-size: 1.1rem;
  color: #333;
}
</style>
