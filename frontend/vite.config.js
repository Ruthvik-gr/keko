import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'VetChatbot',
      fileName: () => 'chatbot.js',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'chatbot.[ext]',
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
