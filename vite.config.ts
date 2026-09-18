import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/rohan-portfolio/',
  plugins: [
    tailwindcss(),
    react(),
  ],
})
