import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: './index.html'  // updated because index.html is in root
    }
  },
  server: {
    host: true,                           // required for Render
    port: Number(process.env.PORT) || 5173,
    strictPort: true                      // prevent fallback
  },
  preview: {
    host: true,
    port: Number(process.env.PORT) || 4173,
    strictPort: true
  }
})
