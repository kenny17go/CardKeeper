import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: '../paddle-built',
    emptyOutDir: true,
    target: 'es2022'
  }
});
