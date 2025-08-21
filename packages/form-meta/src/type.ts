import type { StandardSchemaV1 } from '@standard-schema/spec'

export type FieldsMeta<
  TFormData,
  TFieldType,
  TFieldExtends,
> = {
  [K in keyof TFormData]: FieldMeta<
    K,
    TFormData[K],
    TFieldType,
    TFieldExtends
  >
}

export type FieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
> = {
  name?: TFieldKey
  schema?: StandardSchemaV1<TFieldValue>
  initialValue?: TFieldValue
  extends?: TFieldExtends
} & (
  | {
    type?: never
    nested: 'array'
    subfields: TFieldValue extends Array<infer U>
      ? FieldsMeta<U, TFieldType, TFieldExtends>
      : never
  }
  | {
    type?: never
    nested: 'object'
    subfields: TFieldValue extends object
      ? FieldsMeta<TFieldValue, TFieldType, TFieldExtends>
      : never
  }
  | {
    type: TFieldType
    nested?: never
    subfields?: never
  }
)

export type ResolvedFieldsMeta<
  TFormData,
  TFieldType,
  TFieldExtends,
> = {
  [K in keyof TFormData]: ResolvedFieldMeta<
    K,
    TFormData[K],
    TFieldType,
    TFieldExtends
  >
}
// & {
//   [K in keyof Paths<TFormData, {
//     leavesOnly: true
//   }>]: ResolvedFieldMeta<
//     K,
//     K extends keyof TFormData ? TFormData[K] : unknown, // TFormData[K],
//     TFieldType,
//     TFieldExtends
//   >
// }

export type ResolvedFieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
> = FieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends
> & {
  fullName: string
}
