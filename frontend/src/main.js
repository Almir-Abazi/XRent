import './style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

// Restore session from localStorage before setting up router
const authStore = useAuthStore()
authStore.restoreSession()

app.use(router)

app.mount('#app')
