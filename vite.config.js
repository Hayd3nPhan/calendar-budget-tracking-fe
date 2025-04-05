import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: './public/index.html', // Ensure the input path is correct
    }
  },
  server: {
    port: process.env.PORT || 3000, // Bind the server to the provided PORT, or use 3000 as a fallback
  },
})
