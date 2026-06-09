import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import bookingService from '../services/bookingService'
import { useNotificationStore } from './notification'

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref([])
  const currentBooking = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(0)
  const totalPages = ref(0)
  const bookingType = ref('my')

  const hasNextPage = computed(() => currentPage.value < totalPages.value - 1)
  const hasPrevPage = computed(() => currentPage.value > 0)

  const fetchMyBookings = async (page = 0) => {
    loading.value = true
    error.value = null
    bookingType.value = 'my'
    try {
      const response = await bookingService.getMyBookings(page, 10)
      bookings.value = response.content || []
      currentPage.value = response.number || 0
      totalPages.value = response.totalPages || 1
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load bookings'
    } finally {
      loading.value = false
    }
  }

  const fetchAllBookings = async (page = 0) => {
    loading.value = true
    error.value = null
    bookingType.value = 'all'
    try {
      const response = await bookingService.getAllBookings(page, 10)
      bookings.value = response.content || []
      currentPage.value = response.number || 0
      totalPages.value = response.totalPages || 1
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load bookings'
    } finally {
      loading.value = false
    }
  }

  const createBooking = async (carId, startDate, endDate) => {
    loading.value = true
    error.value = null
    try {
      const response = await bookingService.create(carId, startDate, endDate)
      currentBooking.value = response
      useNotificationStore().success('Booking confirmed successfully!')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create booking'
      error.value = msg
      useNotificationStore().error(msg)
      return false
    } finally {
      loading.value = false
    }
  }

  const cancelBooking = async (id) => {
    loading.value = true
    error.value = null
    try {
      await bookingService.cancel(id)
      if (bookingType.value === 'my') {
        await fetchMyBookings(currentPage.value)
      } else {
        await fetchAllBookings(currentPage.value)
      }
      useNotificationStore().success('Booking cancelled successfully')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel booking'
      error.value = msg
      useNotificationStore().error(msg)
      return false
    } finally {
      loading.value = false
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      if (bookingType.value === 'my') {
        fetchMyBookings(currentPage.value + 1)
      } else {
        fetchAllBookings(currentPage.value + 1)
      }
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      if (bookingType.value === 'my') {
        fetchMyBookings(currentPage.value - 1)
      } else {
        fetchAllBookings(currentPage.value - 1)
      }
    }
  }

  return {
    bookings,
    currentBooking,
    loading,
    error,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    bookingType,
    fetchMyBookings,
    fetchAllBookings,
    createBooking,
    cancelBooking,
    nextPage,
    prevPage
  }
})
