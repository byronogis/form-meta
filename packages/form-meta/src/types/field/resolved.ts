import type { SetRequired } from 'type-fest'
import type { ApplyDefaultOptions, ArrayIncludes, JoinPath, StringKeys, UnionToIntersection } from '../helper.ts'
import type {
  CommonFieldMeta,
  RawFieldsMeta,
} from './raw.ts'

export interface ResolveFieldsMetaOptions {
  /**
   * Fields with these nested types will have their subfields flattened into the parent level.
   *
   * @default []
   */
  flatten?: ('array' | 'object')[]
  /**
   * Fields with these nested types will be removed from the resolved fields meta.
   *
   * @default []
   */
  purge?: ('array' | 'object')[]
}

export interface DefaultResolveFieldsMetaOptions {
  flatten: []
  purge: []
}

export type AnyResolvedFieldMeta = ResolvedFieldMeta<any, any, any, any, any, any, any>
export type AnyResolvedFieldsMeta = ResolvedFieldsMeta<any, any, any, any, any>

export type ResolvedFieldsMeta<
  TRawFieldsMeta extends RawFieldsMeta<any, any, any>,
  TFieldType,
  TFieldExtends,
  TTopFormData,
  TResolveFieldsMetaOptions extends ResolveFieldsMetaOptions,
> = ResolvedFieldsMeta_<TRawFieldsMeta, TFieldType, TFieldExtends, TTopFormData, ApplyDefaultOptions<ResolveFieldsMetaOptions, DefaultResolveFieldsMetaOptions, TResolveFieldsMetaOptions>>

type ResolvedFieldsMeta_<
  TRawFieldsMeta extends RawFieldsMeta<any, any, any>,
  TFieldType,
  TFieldExtends,
  TTopFormData,
  TResolveFieldsMetaOptions extends Required<ResolveFieldsMetaOptions>,
  TPrefix extends string = '',
> = {
  [K in StringKeys<TRawFieldsMeta> as ArrayIncludes<TResolveFieldsMetaOptions['purge'], NonNullable<TRawFieldsMeta[K]>['nested']> extends true
    ? never
    : FieldKey<TPrefix, K, TResolveFieldsMetaOptions>
  ]?: NonNullable<TRawFieldsMeta[K]> extends { nested: 'array' }
    ? ResolvedArrayFieldMeta<NonNullable<TRawFieldsMeta[K]>['subfields'], K, NonNullable<TRawFieldsMeta[K]>['value'], TFieldType, TFieldExtends, TTopFormData, TResolveFieldsMetaOptions, JoinPath<TPrefix, K>>
    : NonNullable<TRawFieldsMeta[K]> extends { nested: 'object' }
      ? ResolvedObjectFieldMeta<NonNullable<TRawFieldsMeta[K]>['subfields'], K, NonNullable<TRawFieldsMeta[K]>['value'], TFieldType, TFieldExtends, TTopFormData, TResolveFieldsMetaOptions, JoinPath<TPrefix, K>>
      : ResolvedPrimitiveFieldMeta<K, NonNullable<TRawFieldsMeta[K]>['value'], TFieldType, TFieldExtends, TTopFormData>
} & FlattenedSubfields<
  TRawFieldsMeta,
  TFieldType,
  TFieldExtends,
  TTopFormData,
  TResolveFieldsMetaOptions,
  TPrefix
>

export type ResolvedFieldMeta<
  TRawFieldsMeta extends RawFieldsMeta<any, any, any>,
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
  TTopFormData,
  TResolveFieldsMetaOptions extends ResolveFieldsMetaOptions,
>
  = | ResolvedPrimitiveFieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends, TTopFormData>
    | ResolvedArrayFieldMeta<TRawFieldsMeta, TFieldKey, TFieldValue, TFieldType, TFieldExtends, TTopFormData, ApplyDefaultOptions<ResolveFieldsMetaOptions, DefaultResolveFieldsMetaOptions, TResolveFieldsMetaOptions>>
    | ResolvedObjectFieldMeta<TRawFieldsMeta, TFieldKey, TFieldValue, TFieldType, TFieldExtends, TTopFormData, ApplyDefaultOptions<ResolveFieldsMetaOptions, DefaultResolveFieldsMetaOptions, TResolveFieldsMetaOptions>>

export interface ResolvedCommonFieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
  TTopFormData,
> extends SetRequired<CommonFieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends, TTopFormData>, 'name'> {
  /**
   * The full name of the field, including all parent field names and array indices.
   */
  fullName: (...indices: number[]) => string
  /**
   * The path of the field as an array of strings.
   */
  path: string[]
  /**
   * The parent field meta. Null if this field is the root field.
   */
  parent: AnyResolvedFieldMeta | null
}

export type ResolvedPrimitiveFieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
  TTopFormData,
> = ResolvedCommonFieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends, TTopFormData> & {
  type: TFieldType
  nested?: never
  subfields?: never
}

type ResolvedArrayFieldMeta<
  TRawFieldsMeta extends RawFieldsMeta<any, any, any>,
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
  TTopFormData,
  TResolveFieldsMetaOptions extends Required<ResolveFieldsMetaOptions>,
  TPrefix extends string = '',
> = ResolvedCommonFieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends, TTopFormData> & {
  type?: never
  nested: 'array'
  subfields: ResolvedFieldsMeta_<TRawFieldsMeta, TFieldType, TFieldExtends, TTopFormData, TResolveFieldsMetaOptions, TPrefix>
}

type ResolvedObjectFieldMeta<
  TRawFieldsMeta extends RawFieldsMeta<any, any, any>,
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
  TTopFormData,
  TResolveFieldsMetaOptions extends Required<ResolveFieldsMetaOptions>,
  TPrefix extends string = '',
> = ResolvedCommonFieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends, TTopFormData> & {
  type?: never
  nested: 'object'
  subfields: ResolvedFieldsMeta_<TRawFieldsMeta, TFieldType, TFieldExtends, TTopFormData, TResolveFieldsMetaOptions, TPrefix>
}

type IsFlattenEnabled<TOptions extends Required<ResolveFieldsMetaOptions>>
  = [TOptions['flatten'][number]] extends [never] ? false : true

type FieldKey<
  TPrefix extends string,
  TKey extends string,
  TOptions extends Required<ResolveFieldsMetaOptions>,
> = IsFlattenEnabled<TOptions> extends true
  ? JoinPath<TPrefix, TKey>
  : TKey

type FlattenedSubfields<
  TRawFieldsMeta extends RawFieldsMeta<any, any, any>,
  TFieldType,
  TFieldExtends,
  TTopFormData,
  TResolveFieldsMetaOptions extends Required<ResolveFieldsMetaOptions>,
  TPrefix extends string,
> = UnionToIntersection<{
  [K in StringKeys<TRawFieldsMeta>]:
  TRawFieldsMeta[K] extends { nested: infer TNested, subfields: infer TSubfields }
    ? ArrayIncludes<TResolveFieldsMetaOptions['flatten'], TNested> extends true
      ? TSubfields extends RawFieldsMeta<any, any, any>
        ? ResolvedFieldsMeta_<
          TSubfields,
          TFieldType,
          TFieldExtends,
          TTopFormData,
          TResolveFieldsMetaOptions,
          JoinPath<TPrefix, K>
        >
        : object
      : object
    : object
}[StringKeys<TRawFieldsMeta>]>
