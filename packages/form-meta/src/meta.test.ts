import { describe, expect, it } from 'vitest'
import { FieldsMeta } from './meta'

type TestFieldType = 'input' | 'textarea' | 'select' | 'checkbox' | 'number'

interface TestFieldExtends {
  placeholder?: string
  disabled?: boolean
  required?: boolean
  validation?: string[]
}

interface SimpleFormData {
  name: string
  email: string
  age: number
}

describe('fieldsMeta', () => {
  describe('constructor', () => {
    it('should create instance with default options', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      expect(fieldsMeta.options.basePath).toBe('')
    })

    it('should create instance with custom basePath', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>({
        basePath: 'form',
      })

      expect(fieldsMeta.options.basePath).toBe('form')
    })
  })

  describe('resolve - basic fields', () => {
    it('should resolve simple fields correctly', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      const result = fieldsMeta.resolve({
        name: {
          type: 'input',
          extends: {
            placeholder: 'Enter your name',
            required: true,
          },
        },
        email: {
          type: 'input',
          extends: {
            placeholder: 'Enter your email',
          },
        },
        age: {
          type: 'number',
          initialValue: 18,
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<SimpleFormData>>[0])

      expect(result).toEqual({
        name: {
          type: 'input',
          name: 'name',
          fullName: 'name',
          extends: {
            placeholder: 'Enter your name',
            required: true,
          },
        },
        email: {
          type: 'input',
          name: 'email',
          fullName: 'email',
          extends: {
            placeholder: 'Enter your email',
          },
        },
        age: {
          type: 'number',
          name: 'age',
          fullName: 'age',
          initialValue: 18,
        },
      })
    })

    it('should resolve fields with basePath', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>({
        basePath: 'form',
      })

      const result = fieldsMeta.resolve({
        name: {
          type: 'input',
        },
        email: {
          type: 'input',
        },
        age: {
          type: 'number',
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<SimpleFormData>>[0]) as any

      expect(result['form.name']).toEqual({
        type: 'input',
        name: 'name',
        fullName: 'form.name',
      })
      expect(result['form.email']).toEqual({
        type: 'input',
        name: 'email',
        fullName: 'form.email',
      })
      expect(result['form.age']).toEqual({
        type: 'number',
        name: 'age',
        fullName: 'form.age',
      })
    })

    it('should override instance basePath with resolve options', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>({
        basePath: 'form',
      })

      interface PartialFormData {
        name: string
      }

      const result = fieldsMeta.resolve({
        name: {
          type: 'input',
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<PartialFormData>>[0], { basePath: 'custom' }) as any

      expect(result['custom.name']).toEqual({
        type: 'input',
        name: 'name',
        fullName: 'custom.name',
      })
    })

    it('should handle fields without extends', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface PartialFormData {
        name: string
      }

      const result = fieldsMeta.resolve({
        name: {
          type: 'input',
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<PartialFormData>>[0])

      expect(result.name).toEqual({
        type: 'input',
        name: 'name',
        fullName: 'name',
      })
    })

    it('should preserve all field properties in resolution', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface PartialFormData {
        name: string
      }

      const result = fieldsMeta.resolve({
        name: {
          type: 'input',
          initialValue: 'John Doe',
          extends: {
            placeholder: 'Full name',
            required: true,
            disabled: false,
            validation: ['min:2', 'max:50'],
          },
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<PartialFormData>>[0])

      expect(result.name).toEqual({
        type: 'input',
        name: 'name',
        fullName: 'name',
        initialValue: 'John Doe',
        extends: {
          placeholder: 'Full name',
          required: true,
          disabled: false,
          validation: ['min:2', 'max:50'],
        },
      })
    })
  })

  describe('resolve - object nested fields', () => {
    it('should resolve object nested fields', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface NestedFormData {
        user: {
          profile: {
            name: string
            email: string
          }
          age: number
        }
      }

      const result = fieldsMeta.resolve({
        user: {
          nested: 'object',
          subfields: {
            profile: {
              nested: 'object',
              subfields: {
                name: {
                  type: 'input',
                  extends: { required: true },
                },
                email: {
                  type: 'input',
                  extends: { placeholder: 'Email address' },
                },
              },
            },
            age: {
              type: 'number',
              initialValue: 25,
            },
          },
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<NestedFormData>>[0])

      // Object nested fields should be flattened
      expect(result['user.profile.name']).toEqual({
        type: 'input',
        name: 'name',
        fullName: 'user.profile.name',
        extends: { required: true },
      })
      expect(result['user.profile.email']).toEqual({
        type: 'input',
        name: 'email',
        fullName: 'user.profile.email',
        extends: { placeholder: 'Email address' },
      })
      expect(result['user.age']).toEqual({
        type: 'number',
        name: 'age',
        fullName: 'user.age',
        initialValue: 25,
      })
    })

    it('should handle deeply nested objects', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface DeepNestedData {
        level1: {
          level2: {
            level3: {
              field: string
            }
          }
        }
      }

      const result = fieldsMeta.resolve({
        level1: {
          nested: 'object',
          subfields: {
            level2: {
              nested: 'object',
              subfields: {
                level3: {
                  nested: 'object',
                  subfields: {
                    field: {
                      type: 'input',
                      initialValue: 'deep value',
                    },
                  },
                },
              },
            },
          },
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<DeepNestedData>>[0])

      expect(result['level1.level2.level3.field']).toEqual({
        type: 'input',
        name: 'field',
        fullName: 'level1.level2.level3.field',
        initialValue: 'deep value',
      })
    })
  })

  describe('resolve - array nested fields', () => {
    it('should resolve array nested fields correctly', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface ArrayFormData {
        addresses: Array<{
          street: string
          city: string
          country: string
        }>
      }

      const result = fieldsMeta.resolve({
        addresses: {
          nested: 'array',
          initialValue: [],
          subfields: {
            street: {
              type: 'input',
              extends: { required: true },
            },
            city: {
              type: 'input',
              extends: { required: true },
            },
            country: {
              type: 'select',
              extends: { required: true },
            },
          },
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<ArrayFormData>>[0])

      // Array field should have subfields
      expect(result.addresses).toEqual({
        nested: 'array',
        name: 'addresses',
        fullName: 'addresses',
        initialValue: [],
        subfields: {
          'addresses[number].street': {
            type: 'input',
            name: 'street',
            fullName: 'addresses[number].street',
            extends: { required: true },
          },
          'addresses[number].city': {
            type: 'input',
            name: 'city',
            fullName: 'addresses[number].city',
            extends: { required: true },
          },
          'addresses[number].country': {
            type: 'select',
            name: 'country',
            fullName: 'addresses[number].country',
            extends: { required: true },
          },
        },
      })
    })

    it('should handle empty array subfields', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface SimpleArrayData {
        tags: string[]
      }

      const result = fieldsMeta.resolve({
        tags: {
          nested: 'array',
          subfields: {} as any,
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<SimpleArrayData>>[0])

      expect(result.tags).toEqual({
        nested: 'array',
        name: 'tags',
        fullName: 'tags',
        subfields: {},
      })
    })

    it('should handle nested arrays with objects', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface NestedArrayData {
        items: Array<{
          metadata: {
            title: string
          }
        }>
      }

      const result = fieldsMeta.resolve({
        items: {
          nested: 'array',
          subfields: {
            metadata: {
              nested: 'object',
              subfields: {
                title: {
                  type: 'input',
                  extends: { placeholder: 'Enter title' },
                },
              },
            },
          },
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<NestedArrayData>>[0])

      expect(result.items).toEqual({
        nested: 'array',
        name: 'items',
        fullName: 'items',
        subfields: {
          'items[number].metadata.title': {
            type: 'input',
            name: 'title',
            fullName: 'items[number].metadata.title',
            extends: { placeholder: 'Enter title' },
          },
        },
      })
    })
  })

  describe('resolve - mixed nested structures', () => {
    it('should handle complex mixed nested structures', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface ComplexFormData {
        user: {
          name: string
          contacts: Array<{
            type: string
            value: string
          }>
        }
        settings: {
          theme: string
        }
      }

      const result = fieldsMeta.resolve({
        user: {
          nested: 'object',
          subfields: {
            name: {
              type: 'input',
              extends: { required: true },
            },
            contacts: {
              nested: 'array',
              subfields: {
                type: {
                  type: 'select',
                },
                value: {
                  type: 'input',
                },
              },
            },
          },
        },
        settings: {
          nested: 'object',
          subfields: {
            theme: {
              type: 'select',
              initialValue: 'light',
            },
          },
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<ComplexFormData>>[0])

      // Check flattened object fields
      expect(result['user.name']).toEqual({
        type: 'input',
        name: 'name',
        fullName: 'user.name',
        extends: { required: true },
      })

      expect(result['settings.theme']).toEqual({
        type: 'select',
        name: 'theme',
        fullName: 'settings.theme',
        initialValue: 'light',
      })

      // Check array field structure
      expect(result['user.contacts']).toEqual({
        nested: 'array',
        name: 'contacts',
        fullName: 'user.contacts',
        subfields: {
          'user.contacts[number].type': {
            type: 'select',
            name: 'type',
            fullName: 'user.contacts[number].type',
          },
          'user.contacts[number].value': {
            type: 'input',
            name: 'value',
            fullName: 'user.contacts[number].value',
          },
        },
      })
    })
  })

  describe('resolve - edge cases', () => {
    it('should handle empty raw fields', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface EmptyData extends Record<string, never> {}

      const result = fieldsMeta.resolve({} satisfies Parameters<typeof fieldsMeta.resolve<EmptyData>>[0])

      expect(result).toEqual({})
    })

    it('should correctly build paths with basePath in nested structures', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface NestedData {
        form: {
          user: {
            name: string
          }
        }
      }

      const result = fieldsMeta.resolve({
        form: {
          nested: 'object',
          subfields: {
            user: {
              nested: 'object',
              subfields: {
                name: {
                  type: 'input',
                },
              },
            },
          },
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<NestedData>>[0], { basePath: 'root' })

      expect(result['root.form.user.name']).toEqual({
        type: 'input',
        name: 'name',
        fullName: 'root.form.user.name',
      })
    })
  })

  describe('internal _resolveBasic function behavior', () => {
    it('should correctly add name and fullName properties to resolved fields', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface SingleFieldData {
        field: string
      }

      const result = fieldsMeta.resolve({
        field: {
          type: 'input',
          initialValue: 'test',
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<SingleFieldData>>[0])

      // Test that _resolveBasic is working correctly by checking the added properties
      expect(result.field).toHaveProperty('name', 'field')
      expect(result.field).toHaveProperty('fullName', 'field')
      expect(result.field).toHaveProperty('type', 'input')
      expect(result.field).toHaveProperty('initialValue', 'test')
    })

    it('should handle array fields with _resolveBasic', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface ArrayFieldData {
        items: Array<{ name: string }>
      }

      const result = fieldsMeta.resolve({
        items: {
          nested: 'array',
          initialValue: [],
          subfields: {
            name: {
              type: 'input',
            },
          },
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<ArrayFieldData>>[0])

      // Array field should also use _resolveBasic for the main field
      expect(result.items).toHaveProperty('name', 'items')
      expect(result.items).toHaveProperty('fullName', 'items')
      expect(result.items).toHaveProperty('nested', 'array')
    })
  })

  describe('path building correctness', () => {
    it('should correctly handle empty basePath', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface TestData {
        field: string
      }

      const result = fieldsMeta.resolve({
        field: {
          type: 'input',
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<TestData>>[0])

      expect(result.field.fullName).toBe('field')
    })

    it('should correctly concatenate basePath with field name', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>({
        basePath: 'prefix',
      })

      interface TestData {
        field: string
      }

      const result = fieldsMeta.resolve({
        field: {
          type: 'input',
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<TestData>>[0]) as any

      expect(result['prefix.field'].fullName).toBe('prefix.field')
    })

    it('should correctly handle array index paths', () => {
      const fieldsMeta = new FieldsMeta<TestFieldType, TestFieldExtends>()

      interface ArrayData {
        items: Array<{ name: string }>
      }

      const result = fieldsMeta.resolve({
        items: {
          nested: 'array',
          subfields: {
            name: {
              type: 'input',
            },
          },
        },
      } satisfies Parameters<typeof fieldsMeta.resolve<ArrayData>>[0])

      expect(result.items.subfields['items[number].name'].fullName).toBe('items[number].name')
    })
  })
})
