/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const globalStylesPath = fileURLToPath(new URL('./src/styles/global.scss', import.meta.url)).replace(/\\/g, '/')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: (source: string, filename: string) =>
          filename.endsWith('.module.scss')
            ? `@use "${globalStylesPath}" as * with ($emit-global: false);\n${source}`
            : source,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
