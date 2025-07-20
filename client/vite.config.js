import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5000,
    fs: {
      strict: false
    },
    // Allow access from Replit domain
    hmr: {
      clientPort: 443,
      overlay: false
    },
    // Add the allowed hosts
    allowedHosts: ['af2e016e-7094-451d-b5b2-40560ea54ef9-00-11pqwzn3wwhu3.spock.replit.dev', '.replit.dev'],
    // Set up proxy for API requests
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
