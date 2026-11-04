import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : (process.env.VITE_BASE || './'),
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
  },
  preview: {
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
