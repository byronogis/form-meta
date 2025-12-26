import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { AnyResolvedFieldMeta, AnyResolvedFieldsMeta } from './resolved.ts'

type OptionalKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? K : never }[keyof T]

export type RawFieldsMeta<
  TFormData,
  TFieldType,
  TFieldExtends,
  TTopFormData = TFormData,
  TClosestFieldArrayValue = never,
> = {
  [K in Exclude<keyof TFormData, OptionalKeys<TFormData>>]: RawFieldMeta<K, TFormData[K], TFieldType, TFieldExtends, TTopFormData, TClosestFieldArrayValue>
} & {
  [K in OptionalKeys<TFormData>]?: RawFieldMeta<K, NonNullable<TFormData[K]>, TFieldType, TFieldExtends, TTopFormData, TClosestFieldArrayValue>
}

export type RawFieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
  TTopFormData = unknown,
  TClosestFieldArrayValue = never,
>
  = | PrimitiveFieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends, TTopFormData, TClosestFieldArrayValue>
    | ArrayFieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends, TTopFormData, TClosestFieldArrayValue>
    | ObjectFieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends, TTopFormData, TClosestFieldArrayValue>

export interface CommonFieldMeta<TFieldKey, TFieldValue, TFieldExtends, TTopFormData = unknown, TClosestFieldArrayValue = unknown> {
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
  extends?: TFieldExtends | ((arg: {
    /**
     * The current field meta.
     */
    field: AnyResolvedFieldMeta
    /**
     * All fields meta in the form.
     */
    fields: AnyResolvedFieldsMeta
    /**
     * Current field value.
     */
    value: TFieldValue
    /**
     * Full form values.
     */
    values: TTopFormData
    /**
     * Closest array value if the field is inside an array.
     */
    closestArrayValue?: TClosestFieldArrayValue
    /**
     * The indices of the array(s) that this field is in.
     */
    indices: number[]
  }) => TFieldExtends)
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
  TTopFormData = unknown,
  TClosestFieldArrayValue = never,
> = CommonFieldMeta<TFieldKey, TFieldValue, TFieldExtends, TTopFormData, TClosestFieldArrayValue> & {
  type: TFieldType
  nested?: never
  subfields?: never
}

type ArrayFieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
  TTopFormData = unknown,
  TClosestFieldArrayValue = never,
> = CommonFieldMeta<TFieldKey, TFieldValue, TFieldExtends, TTopFormData, TClosestFieldArrayValue> & {
  type?: never
  nested: 'array'
  subfields: TFieldValue extends Array<infer U>
    ? RawFieldsMeta<U, TFieldType, TFieldExtends, TTopFormData, TFieldValue>
    : never
}

type ObjectFieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
  TTopFormData = TFieldValue,
  TClosestFieldArrayValue = never,
> = CommonFieldMeta<TFieldKey, TFieldValue, TFieldExtends, TTopFormData, TClosestFieldArrayValue> & {
  type?: never
  nested: 'object'
  subfields: TFieldValue extends Record<string, any>
    ? RawFieldsMeta<TFieldValue, TFieldType, TFieldExtends, TTopFormData, TClosestFieldArrayValue>
    : never
}
