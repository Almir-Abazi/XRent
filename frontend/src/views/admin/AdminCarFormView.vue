<template>
  <div class="admin-car-form-container">
    <h1>{{ isEdit ? 'Edit Car' : 'Create New Car' }}</h1>

    <div v-if="carStore.error" class="error-message">
      {{ carStore.error }}
    </div>

    <form @submit.prevent="handleSubmit" class="form-card">
      <div class="form-group">
        <label for="make">Make</label>
        <input
          id="make"
          v-model="form.make"
          type="text"
          placeholder="e.g., Toyota"
          required
          :disabled="carStore.loading"
        />
      </div>

      <div class="form-group">
        <label for="model">Model</label>
        <input
          id="model"
          v-model="form.model"
          type="text"
          placeholder="e.g., Corolla"
          required
          :disabled="carStore.loading"
        />
      </div>

      <div class="form-group">
        <label for="year">Year</label>
        <input
          id="year"
          v-model.number="form.year"
          type="number"
          min="1886"
          max="2100"
          required
          :disabled="carStore.loading"
        />
      </div>

      <div class="form-group">
        <label for="licensePlate">License Plate</label>
        <input
          id="licensePlate"
          v-model="form.licensePlate"
          type="text"
          placeholder="e.g., ABC-123-XYZ"
          required
          :disabled="carStore.loading"
        />
      </div>

      <div class="form-group">
        <label for="dailyPrice">Daily Price ($)</label>
        <input
          id="dailyPrice"
          v-model.number="form.dailyPrice"
          type="number"
          min="0.01"
          step="0.01"
          required
          :disabled="carStore.loading"
        />
      </div>

      <div class="form-group">
        <label for="available">
          <input
            id="available"
            v-model="form.available"
            type="checkbox"
            :disabled="carStore.loading"
          />
          Available for booking
        </label>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="carStore.loading">
          {{ carStore.loading ? 'Saving...' : isEdit ? 'Update Car' : 'Create Car' }}
        </button>
        <router-link to="/admin/cars" class="btn-cancel">Cancel</router-link>
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

const form = reactive({
  make: '',
  model: '',
  year: new Date().getFullYear(),
  licensePlate: '',
  dailyPrice: 0,
  available: true
})

const handleSubmit = async () => {
  let success
  if (isEdit.value) {
    success = await carStore.updateCar(route.query.id, form)
  } else {
    success = await carStore.createCar(form)
  }

  if (success) {
    router.push({ name: 'adminCars' })
  }
}

onMounted(async () => {
  if (isEdit.value) {
    await carStore.fetchCarById(route.query.id)
    if (carStore.currentCar) {
      form.make = carStore.currentCar.make
      form.model = carStore.currentCar.model
      form.year = carStore.currentCar.year
      form.licensePlate = carStore.currentCar.licensePlate
      form.dailyPrice = carStore.currentCar.dailyPrice
      form.available = carStore.currentCar.available
    }
  }
})
</script>

<style scoped>
.admin-car-form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem 0;
}

.admin-car-form-container h1 {
  margin-bottom: 1.5rem;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #c62828;
}

.form-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input[type="text"]:focus,
.form-group input[type="number"]:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-group input[type="text"]:disabled,
.form-group input[type="number"]:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-group input[type="checkbox"] {
  margin-right: 0.5rem;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
}

.btn-submit {
  flex: 1;
  padding: 0.75rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #1565c0;
}

.btn-submit:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem;
  background-color: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-cancel:hover {
  background-color: #d0d0d0;
}
</style>
