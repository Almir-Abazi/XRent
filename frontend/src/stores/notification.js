import { defineStore } from 'pinia'
import { ref } from 'vue'

let _nextId = 1

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  const add = (message, type = 'info', duration = 4000) => {
    const id = _nextId++
    notifications.value.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }

  const remove = (id) => {
    const idx = notifications.value.findIndex(n => n.id === id)
    if (idx !== -1) notifications.value.splice(idx, 1)
  }

  const success = (message) => add(message, 'success')
  const error = (message) => add(message, 'error')
  const info = (message) => add(message, 'info')

  return { notifications, add, remove, success, error, info }
})
