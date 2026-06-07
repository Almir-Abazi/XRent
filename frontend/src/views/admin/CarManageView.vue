<template>
  <div class="admin-cars-container">
    <div class="header">
      <h1>Manage Cars</h1>
      <router-link to="/admin/cars-form" class="btn-create">+ Create Car</router-link>
    </div>

    <div v-if="carStore.loading" class="loading">Loading cars...</div>

    <div v-else-if="carStore.error" class="error">
      {{ carStore.error }}
    </div>

    <div v-else-if="carStore.cars.length === 0" class="empty">
      No cars found.
    </div>

    <table v-else class="cars-table">
      <thead>
        <tr>
          <th>Make</th>
          <th>Model</th>
          <th>Year</th>
          <th>Plate</th>
          <th>Daily Price</th>
          <th>Available</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in carStore.cars" :key="car.id">
          <td>{{ car.make }}</td>
          <td>{{ car.model }}</td>
          <td>{{ car.year }}</td>
          <td>{{ car.licensePlate }}</td>
          <td>${{ car.dailyPrice }}</td>
          <td>
            <span :class="['status', car.available ? 'available' : 'unavailable']">
              {{ car.available ? 'Yes' : 'No' }}
            </span>
          </td>
          <td class="actions">
            <router-link :to="`/admin/cars-form?id=${car.id}`" class="btn-edit">
              Edit
            </router-link>
            <button @click="deleteCar(car.id)" class="btn-delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="carStore.cars.length > 0" class="pagination">
      <button
        class="btn-pagination"
        :disabled="!carStore.hasPrevPage"
        @click="carStore.prevPage"
      >
        Previous
      </button>
      <span class="page-info">
        Page {{ carStore.currentPage + 1 }} of {{ carStore.totalPages }}
      </span>
      <button
        class="btn-pagination"
        :disabled="!carStore.hasNextPage"
        @click="carStore.nextPage"
      >
        Next
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

onMounted(() => {
  carStore.fetchCars(0, null)
})
</script>

<style scoped>
.admin-cars-container {
  padding: 1rem 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
}

.btn-create {
  background-color: #43a047;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn-create:hover {
  background-color: #2e7d32;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
}

.empty {
  color: #666;
}

.cars-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cars-table thead {
  background-color: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.cars-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.cars-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.cars-table tbody tr:hover {
  background-color: #f9f9f9;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status.available {
  background-color: #c8e6c9;
  color: #2e7d32;
}

.status.unavailable {
  background-color: #ffcccc;
  color: #c62828;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.btn-edit {
  background-color: #1976d2;
  color: white;
}

.btn-edit:hover {
  background-color: #1565c0;
}

.btn-delete {
  background-color: #d32f2f;
  color: white;
}

.btn-delete:hover {
  background-color: #b71c1c;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-pagination {
  padding: 0.5rem 1.5rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-pagination:hover:not(:disabled) {
  background-color: #1565c0;
}

.btn-pagination:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-size: 0.9rem;
}
</style>
