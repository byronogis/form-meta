import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import pkg from '../package.json'

export default defineConfig({
  base: '/form-meta',
  plugins: [
    UnoCSS(),
    ViteEjsPlugin({
      title: `form-meta | Playground`,
      name: 'form-meta',
      version: pkg.version,
      repo: pkg.repository.url,
    }),
  ],
})
