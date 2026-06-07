<template>
  <div class="car-card">
    <div class="car-header">
      <h3>{{ car.make }} {{ car.model }}</h3>
      <span :class="['availability', car.available ? 'available' : 'unavailable']">
        {{ car.available ? 'Available' : 'Unavailable' }}
      </span>
    </div>
    <div class="car-info">
      <p><strong>Year:</strong> {{ car.year }}</p>
      <p><strong>Plate:</strong> {{ car.licensePlate }}</p>
      <p><strong>Daily Price:</strong> ${{ car.dailyPrice }}</p>
    </div>
    <div class="car-actions">
      <router-link :to="`/cars/${car.id}`" class="btn btn-view">View Details</router-link>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  car: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.car-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.car-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.car-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.car-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.availability {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
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

.car-info {
  margin-bottom: 1rem;
}

.car-info p {
  margin: 0.5rem 0;
  color: #666;
}

.car-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
}

.btn-view {
  background-color: #1976d2;
  color: white;
}

.btn-view:hover {
  background-color: #1565c0;
}
</style>
