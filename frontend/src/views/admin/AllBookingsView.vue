<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">All Bookings</h1>
      <p class="text-gray-500 text-sm mt-0.5">Manage bookings across all users</p>
    </div>

    <div v-if="bookingStore.loading" class="flex items-center justify-center py-20">
      <svg class="w-8 h-8 animate-spin text-red-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span class="ml-3 text-gray-500">Loading bookings...</span>
    </div>

    <div v-else-if="bookingStore.error" class="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
      {{ bookingStore.error }}
    </div>

    <div v-else-if="bookingStore.bookings.length === 0" class="text-center py-20 text-gray-500">
      No bookings found.
    </div>

    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Car</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
              <th class="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="booking in bookingStore.bookings" :key="booking.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-5 py-4 text-gray-600 text-xs">{{ booking.userEmail }}</td>
              <td class="px-5 py-4 font-medium text-gray-900">{{ booking.carMake }} {{ booking.carModel }}</td>
              <td class="px-5 py-4 text-gray-600 text-xs whitespace-nowrap">
                {{ formatDate(booking.startDate) }} → {{ formatDate(booking.endDate) }}
              </td>
              <td class="px-5 py-4 font-semibold text-gray-900">${{ booking.totalPrice }}</td>
              <td class="px-5 py-4">
                <span :class="statusClass(booking.status)">{{ booking.status }}</span>
              </td>
              <td class="px-5 py-4 text-gray-400 text-xs">{{ formatDate(booking.createdAt) }}</td>
              <td class="px-5 py-4 text-right">
                <button
                  v-if="booking.status !== 'CANCELLED'"
                  @click="cancelBooking(booking.id)"
                  class="text-xs bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-3 py-1.5 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="bookingStore.bookings.length > 0" class="flex items-center justify-center gap-4 mt-5">
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        :disabled="!bookingStore.hasPrevPage"
        @click="bookingStore.prevPage"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>
      <span class="text-sm text-gray-500">
        Page <strong class="text-gray-900">{{ bookingStore.currentPage + 1 }}</strong> of {{ bookingStore.totalPages }}
      </span>
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        :disabled="!bookingStore.hasNextPage"
        @click="bookingStore.nextPage"
      >
        Next
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBookingStore } from '../../stores/booking'

const bookingStore = useBookingStore()

const formatDate = (d) => {
  if (!d) return ''
  const date = d.length === 10 ? d + 'T00:00:00' : d
  return new Date(date).toLocaleDateString()
}

const statusClass = (status) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  if (status === 'CONFIRMED') return `${base} bg-green-100 text-green-700`
  if (status === 'CANCELLED') return `${base} bg-red-100 text-red-600`
  return `${base} bg-yellow-100 text-yellow-700`
}

const cancelBooking = async (id) => {
  if (confirm('Are you sure you want to cancel this booking?')) {
    await bookingStore.cancelBooking(id)
  }
}

onMounted(() => bookingStore.fetchAllBookings(0))
</script>
