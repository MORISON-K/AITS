import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Serve all built assets under Django's STATIC_URL
  base: '/static/',

  plugins: [react()],

  build: {
    outDir: 'dist',        // output folder
    emptyOutDir: true,     // clear before build
    assetsDir: 'assets',   // assets go under /static/assets
  },

  server: {
    host: '0.0.0.0',
    port: 5000,
    fs: {
      strict: false,
    },
    // Hot Module Replacement over HTTPS
    hmr: {
      clientPort: 443,
      overlay: false,
    },
    // Proxy API calls to Django backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
