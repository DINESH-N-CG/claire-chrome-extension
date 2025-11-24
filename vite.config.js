import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-extension-files',
      closeBundle() {
        // Copy non-React files to dist
        const files = [
          'background.js',
          'Ask_Claire.js',
          'Ask_Claire.css',
          'manifest.json',
          'auth-callback.html'
        ];
        
        mkdirSync('dist/icons', { recursive: true });
        
        files.forEach(file => {
          try {
            copyFileSync(file, `dist/${file}`);
          } catch (e) {
            console.warn(`Could not copy ${file}`);
          }
        });

        // Copy icons
        try {
          copyFileSync('icons/claire-logo.svg', 'dist/icons/claire-logo.svg');
          copyFileSync('icons/claire-logo-16px.png', 'dist/icons/claire-logo-16px.png');
          copyFileSync('icons/claire-logo-48px.png', 'dist/icons/claire-logo-48px.png');
          copyFileSync('icons/claire-logo-128px.png', 'dist/icons/claire-logo-128px.png');
        } catch (e) {
          console.warn('Could not copy icons');
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'sidepanel.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
