import react from '@astrojs/react'
import solidJs from '@astrojs/solid-js'
import starlight from '@astrojs/starlight'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'

// https://astro.build/config
export default defineConfig({
  base: '/form-meta/',
  site: 'https://byronogis.github.io/form-meta/',
  integrations: [
    vue(),
    react({
      include: ['**/React/**/*'],
    }),
    svelte(),
    solidJs({
      include: ['**/Solid/**/*'],
    }),
    UnoCSS(),
    starlight({
      title: 'Form Meta',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/byronogis/form-meta' }],
      defaultLocale: 'root',
      locales: {
        'root': { label: 'English', lang: 'en' },
        'zh-cn': { label: '简体中文', lang: 'zh-CN' },
      },
      sidebar: [
        {
          label: 'Guides',
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Examples',
          autogenerate: { directory: 'example' },
        },
      ],
    }),
  ],
  vite: {
    ssr: {
      noExternal: ['zod'],
    },
  },
})
