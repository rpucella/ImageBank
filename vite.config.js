import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import neutralino from 'vite-plugin-neutralino';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), neutralino()],
  resolve: {
    alias: {
      src: "/src"
    }
  },
  build: {
    rollupOptions: {
      input: "index.html"
    },
    minify: false,
    outDir: "dist-ui"
  }
})
