import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: true,
  },
  base: "./",
  plugins: [react()],
  build: {
    sourcemap: true,
    outDir: "docs",
  },
})
