import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['pyodide']
  },
  plugins: [react()],
  worker: {
    format: 'es'
  }
})
