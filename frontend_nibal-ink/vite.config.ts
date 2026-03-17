import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Esto equivale a --host 0.0.0.0
    port: 5173,
    watch: {
      usePolling: true, // Vital para Docker o carpetas compartidas por red en Debian
    }
  }
})