import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The backend only allows CORS from http://localhost:5173, so the dev server
// must not silently move to another port.
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
  },
  plugins: [react(), tailwindcss()],
});
