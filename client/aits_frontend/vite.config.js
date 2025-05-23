import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    plugins: [react()],
    base: './', // ✅ this ensures all paths are relative for Heroku
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      manifest: true,
    },
  };
});
