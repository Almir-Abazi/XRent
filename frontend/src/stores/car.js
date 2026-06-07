import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import carService from '../services/carService'

export const useCarStore = defineStore('car', () => {
  const cars = ref([])
  const currentCar = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(0)
  const totalPages = ref(0)
  const filterAvailable = ref(null)

  const hasNextPage = computed(() => currentPage.value < totalPages.value - 1)
  const hasPrevPage = computed(() => currentPage.value > 0)

  const fetchCars = async (page = 0, available = null) => {
    loading.value = true
    error.value = null
    try {
      const response = await carService.getAll(page, 10, available)
      cars.value = response.content || []
      currentPage.value = response.number || 0
      totalPages.value = response.totalPages || 1
      filterAvailable.value = available
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load cars'
    } finally {
      loading.value = false
    }
  }

  const fetchCarById = async (id) => {
    loading.value = true
    error.value = null
    try {
      currentCar.value = await carService.getById(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load car'
    } finally {
      loading.value = false
    }
  }

  const createCar = async (carData) => {
    loading.value = true
    error.value = null
    try {
      await carService.create(carData)
      await fetchCars(currentPage.value, filterAvailable.value)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create car'
      return false
    } finally {
      loading.value = false
    }
  }

  const updateCar = async (id, carData) => {
    loading.value = true
    error.value = null
    try {
      await carService.update(id, carData)
      await fetchCars(currentPage.value, filterAvailable.value)
      await fetchCarById(id)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update car'
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteCar = async (id) => {
    loading.value = true
    error.value = null
    try {
      await carService.delete(id)
      await fetchCars(currentPage.value, filterAvailable.value)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete car'
      return false
    } finally {
      loading.value = false
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      fetchCars(currentPage.value + 1, filterAvailable.value)
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      fetchCars(currentPage.value - 1, filterAvailable.value)
    }
  }

  return {
    cars,
    currentCar,
    loading,
    error,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    filterAvailable,
    fetchCars,
    fetchCarById,
    createCar,
    updateCar,
    deleteCar,
    nextPage,
    prevPage
  }
})
