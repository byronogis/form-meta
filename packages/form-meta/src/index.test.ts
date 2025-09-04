import { describe, expect, it } from 'vitest'
import { FieldsMeta } from '.'

describe('form-meta index', () => {
  it('should export FieldsMeta class', () => {
    expect(FieldsMeta).toBeDefined()
    expect(typeof FieldsMeta).toBe('function')
  })

  it('should be able to create FieldsMeta instance', () => {
    const fieldsMeta = new FieldsMeta()
    expect(fieldsMeta).toBeInstanceOf(FieldsMeta)
    expect(fieldsMeta.options).toBeDefined()
    expect(fieldsMeta.resolve).toBeDefined()
    expect(typeof fieldsMeta.resolve).toBe('function')
  })
})
