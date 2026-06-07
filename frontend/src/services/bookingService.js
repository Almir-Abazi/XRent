import http from './http'

const bookingService = {
  create: async (carId, startDate, endDate) => {
    const response = await http.post('/api/bookings', {
      carId,
      startDate,
      endDate
    })
    return response.data
  },

  getMyBookings: async (page = 0, size = 10) => {
    const response = await http.get(`/api/bookings/me?page=${page}&size=${size}`)
    return response.data
  },

  getAllBookings: async (page = 0, size = 10) => {
    const response = await http.get(`/api/bookings?page=${page}&size=${size}`)
    return response.data
  },

  cancel: async (id) => {
    await http.delete(`/api/bookings/${id}`)
  }
}

export default bookingService
