import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@institute': path.resolve(__dirname, './src/modules/institute'),
      '@routes': path.resolve(__dirname, './src/modules/routes'),
    },
  },
});
