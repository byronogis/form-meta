import { describe, expect, it } from 'vitest'
import { sharedFunction } from '../src/index.ts'

describe('shared', () => {
  it('should return string', () => {
    expect(sharedFunction()).toBe('shared')
  })
})
