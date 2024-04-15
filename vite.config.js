import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        'popup.html': 'popup.html',
        'options.html': 'options.html',
      },
    },
  },
})

