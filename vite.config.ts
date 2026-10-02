import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    // Fixed, not auto-incrementing: the backend's CORS allowlist
    // (FRONTEND_ORIGIN) is pinned to :5173. If that port is already taken by
    // a stray dev server, fail loudly instead of silently drifting to 5174+
    // and breaking login with an opaque CORS error.
    port: 5173,
    strictPort: true,
  },
})
