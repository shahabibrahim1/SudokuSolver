import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/solve': 'http://localhost:5000' // adjust to your Python backend URL
    }
  }
});
