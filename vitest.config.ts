import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/*',
      {
        extends: true,
        test: {
          name: 'form-meta:typecheck',
          root: 'packages/form-meta',
          typecheck: {
            enabled: true,
            only: true,
          },
        },
      },
    ],
    coverage: {
      enabled: true,
    },
  },
})
