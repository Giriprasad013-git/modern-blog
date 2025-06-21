import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-robots-txt',
      buildEnd() {
        // Copy the CMS robots.txt to the output directory
        if (!fs.existsSync('dist-cms')) {
          fs.mkdirSync('dist-cms', { recursive: true });
        }
        fs.copyFileSync('public/robots.cms.txt', 'dist-cms/robots.txt');
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-cms',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.cms.html'),
      },
    },
  },
}) 