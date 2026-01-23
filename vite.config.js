import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Exposes the server on the network
    port: 5173,
    strictPort: true, // Fail if the port is already in use
    hmr: {
      timeout: 120000, // Increase HMR timeout to 2 minutes
    }
  }
})
