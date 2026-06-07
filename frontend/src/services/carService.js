import http from './http'

const carService = {
  getAll: async (page = 0, size = 10, available = null) => {
    let url = `/api/cars?page=${page}&size=${size}`
    if (available !== null) {
      url += `&available=${available}`
    }
    const response = await http.get(url)
    return response.data
  },

  getById: async (id) => {
    const response = await http.get(`/api/cars/${id}`)
    return response.data
  },

  create: async (carData) => {
    const response = await http.post('/api/cars', carData)
    return response.data
  },

  update: async (id, carData) => {
    const response = await http.put(`/api/cars/${id}`, carData)
    return response.data
  },

  delete: async (id) => {
    await http.delete(`/api/cars/${id}`)
  }
}

export default carService
