import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCarStore = defineStore('car', () => {
  const cars = ref([])
  const currentCar = ref(null)
  const loading = ref(false)
  const error = ref(null)

  return {
    cars,
    currentCar,
    loading,
    error
  }
})
