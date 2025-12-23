import type { RawFieldsMeta, ResolveFieldsMetaOptions } from '../src/index.ts'
import { describe, expect, it } from 'vitest'
import { FieldsMeta } from '../src/index.ts'

type TestFieldType = 'input' | 'inputnumber' | 'select'

interface TestFieldExtends {
  disabled?: boolean
  placeholder?: string
}

export const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

interface TestFieldsData {
  title: string
  subtitle?: string
  author: {
    name: string
    profileUrl?: string
  }
  sections: Array<{
    heading: string
    paragraphs: Array<{
      text: string
      footnote?: string
    }>
  }>
  layout: {
    blocks: Array<{
      blockType: string
      components: Array<{
        componentType: string
        config?: { enabled: boolean }
      }>
    }>
  }
}

type TestFields = RawFieldsMeta<TestFieldsData, TestFieldType, TestFieldExtends>

export const rawFieldsMeta = {
  title: { type: 'input' },
  subtitle: { type: 'input' },
  author: {
    nested: 'object',
    subfields: {
      name: { type: 'input' },
      profileUrl: { type: 'input' },
    },
  },
  sections: {
    nested: 'array',
    subfields: {
      heading: { type: 'input' },
      paragraphs: {
        nested: 'array',
        subfields: {
          text: { type: 'input' },
          footnote: { type: 'input' },
        },
      },
    },
  },
  layout: {
    nested: 'object',
    subfields: {
      blocks: {
        nested: 'array',
        subfields: {
          blockType: { type: 'input' },
          components: {
            nested: 'array',
            subfields: {
              componentType: { type: 'input' },
              config: {
                nested: 'object',
                subfields: {
                  enabled: { type: 'select' },
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies TestFields

export const optionsKeys = [
  [{}, ['title', 'subtitle', 'author', 'sections', 'layout']],
  [{ flatten: [], purge: [] }, ['title', 'subtitle', 'author', 'sections', 'layout']],
  [{ flatten: ['object'] }, [
    'title',
    'subtitle',
    'author',
    'author.name',
    'author.profileUrl',
    'sections',
    'layout',
    'layout.blocks',
  ]],
  [{ flatten: ['object'], purge: ['object'] }, [
    'title',
    'subtitle',
    'author.name',
    'author.profileUrl',
    'sections',
    'layout.blocks',
  ]],
  [{ flatten: ['object'], purge: ['array'] }, [
    'title',
    'subtitle',
    'author',
    'author.name',
    'author.profileUrl',
    'layout',
  ]],
  [{ flatten: ['object'], purge: ['object', 'array'] }, [
    'title',
    'subtitle',
    'author.name',
    'author.profileUrl',
  ]],
  [{ flatten: ['array'] }, [
    'title',
    'subtitle',
    'author',
    'sections',
    'sections.heading',
    'sections.paragraphs',
    'sections.paragraphs.text',
    'sections.paragraphs.footnote',
    'layout',
  ]],
  [{ flatten: ['array'], purge: ['array'] }, [
    'title',
    'subtitle',
    'author',
    'sections.heading',
    'sections.paragraphs.text',
    'sections.paragraphs.footnote',
    'layout',
  ]],
  [{ flatten: ['array'], purge: ['object'] }, [
    'title',
    'subtitle',
    'sections',
    'sections.heading',
    'sections.paragraphs',
    'sections.paragraphs.text',
    'sections.paragraphs.footnote',
  ]],
  [{ flatten: ['array'], purge: ['array', 'object'] }, [
    'title',
    'subtitle',
    'sections.heading',
    'sections.paragraphs.text',
    'sections.paragraphs.footnote',
  ]],
  [{ flatten: ['object', 'array'] }, [
    'title',
    'subtitle',
    'author',
    'author.name',
    'author.profileUrl',
    'sections',
    'sections.heading',
    'sections.paragraphs',
    'sections.paragraphs.text',
    'sections.paragraphs.footnote',
    'layout',
    'layout.blocks',
    'layout.blocks.blockType',
    'layout.blocks.components',
    'layout.blocks.components.componentType',
    'layout.blocks.components.config',
    'layout.blocks.components.config.enabled',
  ]],
  [{ flatten: ['object', 'array'], purge: ['array'] }, [
    'title',
    'subtitle',
    'author',
    'author.name',
    'author.profileUrl',
    'sections.heading',
    'sections.paragraphs.text',
    'sections.paragraphs.footnote',
    'layout',
    'layout.blocks.blockType',
    'layout.blocks.components.componentType',
    'layout.blocks.components.config',
    'layout.blocks.components.config.enabled',
  ]],
  [{ flatten: ['object', 'array'], purge: ['object'] }, [
    'title',
    'subtitle',
    'author.name',
    'author.profileUrl',
    'sections',
    'sections.heading',
    'sections.paragraphs',
    'sections.paragraphs.text',
    'sections.paragraphs.footnote',
    'layout.blocks',
    'layout.blocks.blockType',
    'layout.blocks.components',
    'layout.blocks.components.componentType',
    'layout.blocks.components.config.enabled',
  ]],
  [{ flatten: ['object', 'array'], purge: ['array', 'object'] }, [
    'title',
    'subtitle',
    'author.name',
    'author.profileUrl',
    'sections.heading',
    'sections.paragraphs.text',
    'sections.paragraphs.footnote',
    'layout.blocks.blockType',
    'layout.blocks.components.componentType',
    'layout.blocks.components.config.enabled',
  ]],
] as const satisfies [ResolveFieldsMetaOptions, string[]][]

describe('fields meta', () => {
  describe('resolve', () => {
    it.for(optionsKeys)('should resolve fields meta correctly with options $0', ([options, expectedKeys]: [ResolveFieldsMetaOptions, string[]], { expect }) => {
      const resolved = fieldsMeta.resolve(rawFieldsMeta, options)
      expect(Object.keys(resolved)).toEqual(expect.arrayContaining(expectedKeys))
      expect(Object.keys(resolved)).toHaveLength(expectedKeys.length)
    })
  })

  describe('defaultFullNameFormatter', () => {
    it('should generate correct fullName for top level fields', () => {
      const resolved = fieldsMeta.resolve(rawFieldsMeta, { flatten: ['object', 'array'] })
      expect(resolved.title?.fullName()).toBe('title')
    })

    it('should generate correct fullName for nested object fields', () => {
      const resolved = fieldsMeta.resolve(rawFieldsMeta, { flatten: ['object', 'array'] })
      expect(resolved['author.name']?.fullName()).toBe('author.name')
      expect(resolved['author.profileUrl']?.fullName()).toBe('author.profileUrl')
    })

    it('should generate correct fullName for nested array fields', () => {
      const resolved = fieldsMeta.resolve(rawFieldsMeta, { flatten: ['object', 'array'] })
      expect(resolved['sections.heading']?.fullName()).toBe('sections[number].heading')
      expect(resolved['sections.paragraphs.text']?.fullName()).toBe('sections[number].paragraphs[number].text')
      expect(resolved['sections.paragraphs.footnote']?.fullName(2, 3)).toBe('sections[2].paragraphs[3].footnote')
      expect(resolved['sections.paragraphs.footnote']?.fullName(2, 3, 4)).not.toBe('sections[2].paragraphs[3].footnote')
      expect(resolved['sections.paragraphs.footnote']?.fullName(2, 3, 4)).toBe('sections[3].paragraphs[4].footnote')
    })

    it('should generate correct fullName for deeply nested fields', () => {
      const resolved = fieldsMeta.resolve(rawFieldsMeta, { flatten: ['object', 'array'] })
      expect(resolved['layout.blocks.blockType']?.fullName()).toBe('layout.blocks[number].blockType')
      expect(resolved['layout.blocks.components.componentType']?.fullName()).toBe('layout.blocks[number].components[number].componentType')
      expect(resolved['layout.blocks.components.config.enabled']?.fullName(1, 2)).toBe('layout.blocks[1].components[2].config.enabled')
    })
  })
})
