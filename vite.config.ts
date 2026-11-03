import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/baby/api': {
        target: 'http://localhost',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost/baby',
        changeOrigin: true,
      }
    }
  }
})
