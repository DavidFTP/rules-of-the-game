import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/rules-of-the-game/',
  server: {
    host: true, // This forces Vite to expose the Network URL
  }
})
