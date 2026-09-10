import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/when-halos-burn/' : '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        story: resolve(__dirname, 'story.html'),
        chapter: resolve(__dirname, 'chapter.html'),
        archive: resolve(__dirname, 'archive.html'),
        world: resolve(__dirname, 'world.html'),
        extras: resolve(__dirname, 'extras.html')
      }
    }
  }
}))
