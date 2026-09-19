import { defineConfig } from 'vite';
export default defineConfig({build:{lib:{entry:'paddle-entry.js',formats:['es'],fileName:'paddle-ocr'},outDir:'dist',emptyOutDir:true,target:'es2022'}});
