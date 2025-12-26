/* eslint-disable unused-imports/no-unused-vars */
import type { FnPart } from '../src/types/helper.ts'
import { expectTypeOf, test } from 'vitest'
import { fieldsMeta, optionsKeys, rawFieldsMeta } from './field.test.ts'

test('fields resolved keys type should match expected keys', () => {
  const resolved0 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[0][0])
  expectTypeOf<keyof typeof resolved0>().toEqualTypeOf<typeof optionsKeys[0][1][number]>()

  const resolved1 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[1][0])
  expectTypeOf<keyof typeof resolved1>().toEqualTypeOf<typeof optionsKeys[1][1][number]>()

  const resolved2 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[2][0])
  expectTypeOf<keyof typeof resolved2>().toEqualTypeOf<typeof optionsKeys[2][1][number]>()

  const resolved3 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[3][0])
  expectTypeOf<keyof typeof resolved3>().toEqualTypeOf<typeof optionsKeys[3][1][number]>()

  const resolved4 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[4][0])
  expectTypeOf<keyof typeof resolved4>().toEqualTypeOf<typeof optionsKeys[4][1][number]>()

  const resolved5 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[5][0])
  expectTypeOf<keyof typeof resolved5>().toEqualTypeOf<typeof optionsKeys[5][1][number]>()

  const resolved6 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[6][0])
  expectTypeOf<keyof typeof resolved6>().toEqualTypeOf<typeof optionsKeys[6][1][number]>()

  const resolved7 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[7][0])
  expectTypeOf<keyof typeof resolved7>().toEqualTypeOf<typeof optionsKeys[7][1][number]>()

  const resolved8 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[8][0])
  expectTypeOf<keyof typeof resolved8>().toEqualTypeOf<typeof optionsKeys[8][1][number]>()

  const resolved9 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[9][0])
  expectTypeOf<keyof typeof resolved9>().toEqualTypeOf<typeof optionsKeys[9][1][number]>()

  const resolved10 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[10][0])
  expectTypeOf<keyof typeof resolved10>().toEqualTypeOf<typeof optionsKeys[10][1][number]>()

  const resolved11 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[11][0])
  expectTypeOf<keyof typeof resolved11>().toEqualTypeOf<typeof optionsKeys[11][1][number]>()

  const resolved12 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[12][0])
  expectTypeOf<keyof typeof resolved12>().toEqualTypeOf<typeof optionsKeys[12][1][number]>()

  const resolved13 = fieldsMeta.resolve(rawFieldsMeta, optionsKeys[13][0])
  expectTypeOf<keyof typeof resolved13>().toEqualTypeOf<typeof optionsKeys[13][1][number]>()
  type ExtendFn = FnPart<NonNullable<NonNullable<typeof resolved13['layout.blocks.components.config.enabled']>['extends']>>
  // eslint-disable-next-line ts/no-unused-expressions
  expectTypeOf<ExtendFn>().parameters.toEqualTypeOf<[{
    field: any
    fields: any
    value: unknown
    values: unknown
    closestArrayValue: unknown
    indices: number[]
  }]>
})
