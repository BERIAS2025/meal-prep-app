import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base so the same build works from a domain root, from a GitHub
  // Pages project sub-path (user.github.io/<repo>/), or from anywhere else —
  // no rebuild, no config change.
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    // One bundle keeps the service worker's precache trivially correct and
    // removes any chance of a stale-chunk mismatch after an update.
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
