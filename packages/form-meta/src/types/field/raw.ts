import type { StandardSchemaV1 } from '@standard-schema/spec'

type OptionalKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? K : never }[keyof T]

export type RawFieldsMeta<
  TFormData,
  TFieldType,
  TFieldExtends,
> = {
  [K in Exclude<keyof TFormData, OptionalKeys<TFormData>>]: RawFieldMeta<K, TFormData[K], TFieldType, TFieldExtends>
} & {
  [K in OptionalKeys<TFormData>]?: RawFieldMeta<K, NonNullable<TFormData[K]>, TFieldType, TFieldExtends>
}

export type RawFieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
>
  = | PrimitiveFieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends>
    | ArrayFieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends>
    | ObjectFieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends>

export interface CommonFieldMeta<TFieldKey, TFieldValue, TFieldExtends> {
  /**
   * The name of the field.
   *
   * Noneed to specify this manually; it will be set automatically when the field is resolved.
   */
  name?: TFieldKey
  /**
   * The schema associated with this field.
   *
   * Support schemas from Standard Schema v1.
   * Meaning you can use third-party libraries which implement this spec (e.g. Zod, Valibot, Yup, etc.).
   */
  schema?: StandardSchemaV1<TFieldValue>
  /**
   * The type that this field extends.
   *
   * It is designed for users to create their own custom field meta types.
   */
  extends?: TFieldExtends
  /**
   * NOTE Just used for type inference; does not affect runtime behavior.
   */
  value?: TFieldValue
}

type PrimitiveFieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
> = CommonFieldMeta<TFieldKey, TFieldValue, TFieldExtends> & {
  type: TFieldType
  nested?: never
  subfields?: never
}

type ArrayFieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
> = CommonFieldMeta<TFieldKey, TFieldValue, TFieldExtends> & {
  type?: never
  nested: 'array'
  subfields: TFieldValue extends Array<infer U>
    ? RawFieldsMeta<U, TFieldType, TFieldExtends>
    : never
}

type ObjectFieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
> = CommonFieldMeta<TFieldKey, TFieldValue, TFieldExtends> & {
  type?: never
  nested: 'object'
  subfields: TFieldValue extends Record<string, any>
    ? RawFieldsMeta<TFieldValue, TFieldType, TFieldExtends>
    : never
}
