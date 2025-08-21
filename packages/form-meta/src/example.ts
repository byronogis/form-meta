import { z } from 'zod'
import {
  defineFieldsMeta,
  resolveFieldsMeta,
} from './meta'
// import type {
//   FieldsMeta,
//   FieldMeta,
// } from './meta'

const schema = z.object({
  name: z.object({
    first: z.string().default('John'),
    last: z.string().default('Doe'),
  }),
  age: z.number().default(18),
  links: z.array(z.object({
    url: z.object({
      protocol: z.string().default('https'),
      host: z.string().default('example.com'),
    }),
    title: z.string().optional(),
  })).default([]),
})

type Schema = z.infer<typeof schema>

export const example = resolveFieldsMeta<
  Schema,
  'input' | 'inputNumber',
  {
    disabled?: boolean
  }
>(defineFieldsMeta<
  Schema,
  'input' | 'inputNumber',
  {
    disabled?: boolean
  }
>({
  name: {
    nested: 'object',
    subfields: {
      first: {
        name: 'first',
        type: 'input',
        initialValue: 'John',
        extends: {
          disabled: false,
        } as const,
      },
      last: {
        name: 'last',
        type: 'input',
        initialValue: 'Doe',
        extends: {
          disabled: false,
        } as const,
      },
    },
  },
  age: {
    name: 'age',
    type: 'inputNumber',
    initialValue: 18,
    extends: {
      disabled: false,
    } as const,
  },
  links: {
    name: 'links',
    schema: schema.pick({ links: true }) as any,
    nested: 'array',
    initialValue: [],
    subfields: {
      url: {
        name: 'url',
        nested: 'object',
        subfields: {
          protocol: {
            name: 'protocol',
            type: 'input',
            initialValue: 'https',
            extends: {
              disabled: false,
            } as const,
          },
          host: {
            name: 'host',
            type: 'input',
            initialValue: 'example.com',
            extends: {
              disabled: false,
            } as const,
          },
        },
      },
      title: {
        type: 'input',
      },
    },
  },
}))

console.log({
  example,
})
