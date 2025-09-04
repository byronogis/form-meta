import type { StandardSchemaV1 } from '@standard-schema/spec'

/**
 * Represents the raw meta information for all fields in a form.
 * This type maps each key in the form data to its corresponding field meta.
 */
export type RawFieldsMeta<
  TFormData,
  TFieldType,
  TFieldExtends,
> = {
  [K in keyof TFormData]: RawFieldMeta<
    K,
    TFormData[K],
    TFieldType,
    TFieldExtends
  >
}

/**
 * Represents the raw meta information for a single field in the form.
 * It includes properties like name, schema, initial value, and extensions,
 * and handles nested structures for arrays and objects.
 */
export type RawFieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
> = {
  /**
   * The name of the field, which should match the key in the parent object.
   */
  name?: TFieldKey
  /**
   * An optional JSON Schema that describes the field's value,
   * conforming to StandardSchema and which implemented this spec.
   *
   * @see https://standardschema.dev/
   */
  schema?: StandardSchemaV1<TFieldValue>
  /**
   * The initial value of the field.
   */
  initialValue?: TFieldValue
  /**
   * Custom meta properties to extend the field meta for user-specific purposes.
   */
  extends?: TFieldExtends
} & (
  | {
    type?: never
    /**
     * Indicates that the field is an array of subfields.
     */
    nested: 'array'
    /**
     * Meta information for the subfields within the array.
     * Inferred from the array element type.
     */
    subfields: TFieldValue extends Array<infer U>
      ? RawFieldsMeta<U, TFieldType, TFieldExtends>
      : never
  }
  | {
    type?: never
    /**
     * Indicates that the field is an object with subfields.
     */
    nested: 'object'
    /**
     * Meta information for the subfields within the object.
     * Inferred from the object's structure.
     */
    subfields: TFieldValue extends Record<string, any>
      ? RawFieldsMeta<TFieldValue, TFieldType, TFieldExtends>
      : never
  }
  | {
    /**
     * The type of the field, e.g., 'input', 'select', etc.
     * This should be omitted if the field is nested (i.e., an object or array).
     */
    type: TFieldType
    nested?: never
    subfields?: never
  }
)

/**
 * Represents the resolved meta information for all fields in the form after flattening nested structures.
 * This type flattens the hierarchy into a single-level object with full paths.
 */
export type ResolvedFieldsMeta<
  TFieldsMeta,
  TFieldType,
  TFieldExtends,
  TPrefix extends string = '',
> = FlattenFields<
  TFieldsMeta,
  TFieldType,
  TFieldExtends,
  TPrefix
>

/**
 * A helper type to flatten nested fields into a single-level structure.
 * It processes arrays and objects, creating full paths for each field.
 */
type FlattenFields<
  TFieldsMeta,
  TFieldType,
  TFieldExtends,
  TPrefix extends string = '',
>
// Handle non-object nested fields
= {
  [K in keyof TFieldsMeta as TFieldsMeta[K] extends { nested: 'object' }
    ? any
    : JoinPath<TPrefix, K>
  ]: TFieldsMeta[K] extends { nested: 'array', subfields: infer TSubfields }
    ? Omit<RawFieldMeta<
        K,
        TFieldsMeta[K] extends { initialValue: infer IV } ? IV : unknown,
        TFieldType,
        TFieldExtends
      >, 'name' | 'subfields'> & {
        name: K
        fullName: JoinPath<TPrefix, K>
        subfields: FlattenFields<
          TSubfields,
          TFieldType,
          TFieldExtends,
          `${JoinPath<TPrefix, K>}[number]`
        >
      }
    : Omit<RawFieldMeta<
        K,
        TFieldsMeta[K] extends { initialValue: infer IV } ? IV : unknown,
        TFieldType,
        TFieldExtends
      >, 'name' | 'subfields'> & {
        fullName: JoinPath<TPrefix, K>
      }
}
  // Handle object nested fields by promoting subfields
& FlattenObjectFields<TFieldsMeta, TFieldType, TFieldExtends, TPrefix>

/**
 * A helper type to specifically handle the promotion of subfields for object nested fields,
 * simplifying the overall flattening logic.
 */
type FlattenObjectFields<
  TFieldsMeta,
  TFieldType,
  TFieldExtends,
  TPrefix extends string,
> = TFieldsMeta extends Record<string, any>
  ? {
      [K in keyof TFieldsMeta]: TFieldsMeta[K] extends { nested: 'object', subfields: infer TSubfields }
        ? FlattenFields<TSubfields, TFieldType, TFieldExtends, JoinPath<TPrefix, K>>
        : object
    }[keyof TFieldsMeta]
  : object

/**
 * A helper type to join path segments into a full path string.
 * Handles empty prefixes and concatenates with dots or brackets as appropriate.
 */
type JoinPath<TPrefix extends string, TKey> = TPrefix extends ''
  ? TKey extends string | number
    ? `${TKey}`
    : never
  : TKey extends string | number
    ? `${TPrefix}.${TKey}`
    : never
