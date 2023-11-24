import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      "/api":{
        target:"https://rubrica.marketingbf.store/",
        changeOrigin:true,
      }
    }
  },
  plugins: [react()]
})
