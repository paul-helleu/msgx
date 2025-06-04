import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5138,
    proxy: {
      '/api': {
        target: 'http://192.168.1.12:3000',
        changeOrigin: true,
      },
    },
  },
});
