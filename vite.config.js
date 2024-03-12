import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const serverPort = process.env.PORT || 3000;
console.log(`api server should run on port ${serverPort}`);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': `http://localhost:${serverPort}`
    }
  }
})