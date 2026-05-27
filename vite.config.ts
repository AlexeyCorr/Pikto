import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/pikto/',
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        en: resolve(__dirname, 'en/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['@jsquash/jpeg', '@jsquash/webp', '@jsquash/avif', '@jsquash/oxipng'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    globals: true,
  },
  worker: {
    format: 'es',
  },
});
