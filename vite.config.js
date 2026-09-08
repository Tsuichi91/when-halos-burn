import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/when-halos-burn/' : '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        story: resolve(__dirname, 'story.html'),
        archive: resolve(__dirname, 'archive.html')
      }
    }
  }
}))
