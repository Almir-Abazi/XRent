<template>
  <div class="my-bookings-container">
    <h1>My Bookings</h1>

    <div v-if="bookingStore.loading" class="loading">Loading bookings...</div>

    <div v-else-if="bookingStore.error" class="error">
      {{ bookingStore.error }}
    </div>

    <div v-else-if="bookingStore.bookings.length === 0" class="empty">
      <p>You haven't made any bookings yet.</p>
      <router-link to="/cars" class="btn-browse">Browse Cars</router-link>
    </div>

    <table v-else class="bookings-table">
      <thead>
        <tr>
          <th>Car</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Total Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookingStore.bookings" :key="booking.id">
          <td>{{ booking.carMake }} {{ booking.carModel }}</td>
          <td>{{ formatDate(booking.startDate) }}</td>
          <td>{{ formatDate(booking.endDate) }}</td>
          <td>${{ booking.totalPrice }}</td>
          <td>
            <span :class="['status', booking.status.toLowerCase()]">
              {{ booking.status }}
            </span>
          </td>
          <td>
            <button
              v-if="booking.status !== 'CANCELLED'"
              @click="cancelBooking(booking.id)"
              class="btn-cancel-booking"
            >
              Cancel
            </button>
            <span v-else class="text-muted">—</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="bookingStore.bookings.length > 0" class="pagination">
      <button
        class="btn-pagination"
        :disabled="!bookingStore.hasPrevPage"
        @click="bookingStore.prevPage"
      >
        Previous
      </button>
      <span class="page-info">
        Page {{ bookingStore.currentPage + 1 }} of {{ bookingStore.totalPages }}
      </span>
      <button
        class="btn-pagination"
        :disabled="!bookingStore.hasNextPage"
        @click="bookingStore.nextPage"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBookingStore } from '../../stores/booking'

const bookingStore = useBookingStore()

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const cancelBooking = async (id) => {
  if (confirm('Are you sure you want to cancel this booking?')) {
    await bookingStore.cancelBooking(id)
  }
}

onMounted(() => {
  bookingStore.fetchMyBookings(0)
})
</script>

<style scoped>
.my-bookings-container {
  padding: 1rem 0;
}

.my-bookings-container h1 {
  margin-bottom: 2rem;
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

.btn-browse {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #1976d2;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.btn-browse:hover {
  background-color: #1565c0;
}

.bookings-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bookings-table thead {
  background-color: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.bookings-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.bookings-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.bookings-table tbody tr:hover {
  background-color: #f9f9f9;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status.pending {
  background-color: #fff9c4;
  color: #f57f17;
}

.status.confirmed {
  background-color: #c8e6c9;
  color: #2e7d32;
}

.status.cancelled {
  background-color: #ffcccc;
  color: #c62828;
}

.btn-cancel-booking {
  padding: 0.5rem 1rem;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-cancel-booking:hover {
  background-color: #b71c1c;
}

.text-muted {
  color: #999;
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
