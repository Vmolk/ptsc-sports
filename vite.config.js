import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Split vendor code so the main bundle stays small (faster first load)
    rollupOptions: {
      output: {
        manualChunks: {
          'vendors': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    // During `vite` dev, proxy /api calls to a locally running function server.
    // When using `netlify dev`, Netlify handles routing instead (port 8888).
    proxy: {
      '/api': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/.netlify/functions'),
      },
    },
  },
});
