import { describe, expect, it } from 'vitest'
import { defineFormMeta } from '.'

describe('form-meta', () => {
  it('should define config', () => {
    const _config = {}
    const config = defineFormMeta(_config)

    expect(config).toBeDefined()
    expect(config).toEqual(_config)
  })
})
