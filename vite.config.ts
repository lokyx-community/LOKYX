import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],

  base: command === 'build'
    ? '/LOKYX/'
    : '/',

  server: {
    host: true,
    port: 5173,
  },

  build: {
    target: 'es2020',
  },
}));