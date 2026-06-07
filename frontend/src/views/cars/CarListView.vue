<template>
  <div class="car-list-container">
    <div class="header">
      <h1>Available Cars</h1>
      <div class="filters">
        <button
          :class="['filter-btn', !filterAvailable ? 'active' : '']"
          @click="setFilter(null)"
        >
          All Cars
        </button>
        <button
          :class="['filter-btn', filterAvailable === true ? 'active' : '']"
          @click="setFilter(true)"
        >
          Available Only
        </button>
        <button
          :class="['filter-btn', filterAvailable === false ? 'active' : '']"
          @click="setFilter(false)"
        >
          Unavailable
        </button>
      </div>
    </div>

    <div v-if="carStore.loading" class="loading">Loading cars...</div>

    <div v-else-if="carStore.error" class="error">
      {{ carStore.error }}
    </div>

    <div v-else-if="carStore.cars.length === 0" class="empty">
      No cars found.
    </div>

    <div v-else class="cars-grid">
      <CarCard v-for="car in carStore.cars" :key="car.id" :car="car" />
    </div>

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
import { onMounted, computed } from 'vue'
import { useCarStore } from '../../stores/car'
import CarCard from '../../components/cars/CarCard.vue'

const carStore = useCarStore()
const filterAvailable = computed(() => carStore.filterAvailable)

const setFilter = (available) => {
  carStore.fetchCars(0, available)
}

onMounted(() => {
  if (carStore.cars.length === 0) {
    carStore.fetchCars(0, null)
  }
})
</script>

<style scoped>
.car-list-container {
  padding: 1rem 0;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  margin-bottom: 1rem;
}

.filters {
  display: flex;
  gap: 0.75rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background-color: #e0e0e0;
  border: 1px solid #bbb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn.active {
  background-color: #1976d2;
  color: white;
  border-color: #1976d2;
}

.filter-btn:hover:not(.active) {
  background-color: #d0d0d0;
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

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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
