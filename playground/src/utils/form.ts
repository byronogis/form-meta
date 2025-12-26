import type { ResolvedFieldMeta, ResolvedFieldsMeta } from 'form-meta'
import type { TestFieldExtends, TestFieldType } from '../../../packages/form-meta/test/field.test.ts'
import { fieldsMeta, rawFieldsMeta } from '../../../packages/form-meta/test/field.test.ts'

export type { TestFieldsData } from '../../../packages/form-meta/test/field.test.ts'

export type TestResolvedFieldMeta<V = any> = ResolvedFieldMeta<
  any,
  string,
  V,
  TestFieldType,
  TestFieldExtends,
  any,
  {
    flatten: ['object']
    purge: ['object']
  }
>

export type TestResolvedFieldsMeta = ResolvedFieldsMeta<
  any,
  TestFieldType,
  TestFieldExtends,
  any,
  {
    flatten: ['object']
    purge: ['object']
  }
>

export const fm = fieldsMeta.resolve(rawFieldsMeta, {
  flatten: ['object'],
  purge: ['object'],
  parentCircleReferences: false,
})
