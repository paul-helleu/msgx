import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import fs from 'fs';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  server: {
    port: 5138,
    https: {
      key: fs.readFileSync('./certs/cert.key'),
      cert: fs.readFileSync('./certs/cert.crt'),
    },
    proxy: {
      '/api': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
