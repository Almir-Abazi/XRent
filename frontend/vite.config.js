import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: false,
    hmr: {
      protocol: 'http',
      host: 'localhost',
      port: 5173
    }
  }
})
