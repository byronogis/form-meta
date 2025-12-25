import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'

// https://astro.build/config
export default defineConfig({
  base: '/form-meta/',
  site: 'https://byronogis.github.io/form-meta/',
  integrations: [
    vue(),
    react(),
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
          label: 'Reference',
          autogenerate: { directory: 'reference' },
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
