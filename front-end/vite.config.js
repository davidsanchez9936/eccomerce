import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175
  },
  define: {
    global: 'window', // Agrega esta línea para definir "global" en el navegador
  }
})
