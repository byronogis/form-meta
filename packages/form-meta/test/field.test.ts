import type { AnyResolvedFieldMeta, AnyResolvedFieldsMeta, RawFieldsMeta, ResolveFieldsMetaOptions } from '../src/index.ts'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { FieldsMeta } from '../src/index.ts'

export type TestFieldType = 'input' | 'inputnumber' | 'select'

export interface TestFieldExtends {
  disabled?: (arg: {
    field: AnyResolvedFieldMeta
    fields: AnyResolvedFieldsMeta
    value: any
    values: any
    arrayValue?: any[]
    indices: number[]
  }) => boolean
  placeholder?: string
  label?: string
  options?: Array<{ label: string, value: any }>
  defaultValue?: any
}

export const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

export interface TestFieldsData {
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
  layout?: {
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
  title: {
    type: 'input',
    schema: z.string().min(1, { error: 'Title is required' }),
    extends: {
      label: 'Title',
      // defaultValue: '',
    },
  },
  subtitle: {
    type: 'input',
    extends: {
      label: 'Subtitle',
    },
  },
  author: {
    nested: 'object',
    subfields: {
      name: {
        type: 'input',
        extends: {
          label: 'Author Name',
        },
      },
      profileUrl: {
        type: 'input',
        extends: {
          label: 'Author Profile URL',
        },
      },
    },
  },
  sections: {
    nested: 'array',
    subfields: {
      heading: {
        type: 'input',
        extends: {
          label: 'Heading',
        },
      },
      paragraphs: {
        nested: 'array',
        subfields: {
          text: {
            type: 'input',
            extends: {
              label: 'Text',
            },
          },
          footnote: {
            type: 'input',
            extends: {
              label: 'Footnote',
            },
          },
        },
        extends: {
          label: 'Paragraphs',
        },
      },
    },
    extends: {
      label: 'Sections',
      // defaultValue: [{}],
    },
  },
  layout: {
    nested: 'object',
    subfields: {
      blocks: {
        nested: 'array',
        subfields: {
          blockType: {
            type: 'input',
            extends: {
              label: 'Block Type',
            },
          },
          components: {
            nested: 'array',
            subfields: {
              componentType: {
                type: 'input',
                extends: {
                  label: 'Type',
                  disabled({
                    arrayValue,
                    indices,
                  }) {
                    const res = arrayValue?.[indices.at(-1)!]?.config?.enabled === 'false'
                    // eslint-disable-next-line prefer-rest-params
                    console.info({ arguments, res })
                    return res
                  },
                },
              },
              config: {
                nested: 'object',
                subfields: {
                  enabled: {
                    type: 'select',
                    extends: {
                      label: 'Enabled',
                      options: [
                        { label: 'Enabled', value: 'true' },
                        { label: 'Disabled', value: 'false' },
                      ],
                    },
                  },
                },
              },
            },
            extends: {
              label: 'Components',
            },
          },
        },
        extends: {
          label: 'Layout Blocks',
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
