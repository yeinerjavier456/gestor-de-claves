import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirigir llamadas de API al backend PHP en desarrollo local
      '/backend': {
        target: 'http://localhost:8000', // Asumiendo que PHP corre en el puerto 8000
        changeOrigin: true,
        // No reescribimos path porque queremos que coincida con la estructura de carpetas
      }
    }
  }
})
