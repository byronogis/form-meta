import type {
  DefaultResolveFieldsMetaOptions,
  RawFieldsMeta,
  ResolvedCommonFieldMeta,
  ResolvedFieldMeta,
  ResolvedFieldsMeta,
  ResolveFieldsMetaOptions,
} from './types/field/index.ts'

export class FieldsMeta<
  TFieldType,
  TFieldExtends,
> {
  options: ResolvedFieldsMetaOptions

  constructor(options: FieldsMetaOptions = {}) {
    this.options = this.resolveOptions(options)
  }

  resolve<
    TFormData_,
    TResolveFieldsMetaOptions_ extends ResolveFieldsMetaOptions = ResolveFieldsMetaOptions,
    TRawFieldsMeta_ extends RawFieldsMeta<TFormData_, TFieldType, TFieldExtends> = RawFieldsMeta<TFormData_, TFieldType, TFieldExtends>,
    TResolvedFieldsMeta_ extends ResolvedFieldsMeta<TRawFieldsMeta_, TFieldType, TFieldExtends, TResolveFieldsMetaOptions_> = ResolvedFieldsMeta<TRawFieldsMeta_, TFieldType, TFieldExtends, TResolveFieldsMetaOptions_>,
  >(
    raw: TRawFieldsMeta_,
    options?: FieldsMetaOptions & TResolveFieldsMetaOptions_,
    parent_: ResolvedFieldMeta<any, any, any, any, any, any> | null = null,
    resolved_: TResolvedFieldsMeta_ = {} as TResolvedFieldsMeta_,
  ): TResolvedFieldsMeta_ {
    const options_: Required<FieldsMetaOptions & ResolveFieldsMetaOptions> = Object.assign({}, {
      ...this.options,
      purge: [],
      flatten: [],
    } satisfies ResolvedFieldsMetaOptions & DefaultResolveFieldsMetaOptions, options)
    const {
      flatten,
      purge,
      fullNameFormatter,
      parentCircleReferences,
    } = options_

    for (const key in raw) {
      const meta = raw[key]
      const fullName = fullNameFormatter(key, parent_)
      const path = [...parent_?.path || [], key]
      const nestedKey = path.join('.')

      const meta_ = {
        ...meta,
        name: key,
        fullName,
        path: [...parent_?.path || [], key],
        parent: parentCircleReferences
          ? parent_
          : parent_ ? { ...parent_ } : null,
      } satisfies ResolvedFieldMeta<RawFieldsMeta<any, TFieldType, TFieldExtends>, any, any, TFieldType, TFieldExtends, TResolveFieldsMetaOptions_>

      const nested = meta_.nested

      switch (nested) {
        case 'array':
        case 'object': {
          const subfields = this.resolve(meta.subfields!, options_, meta_)
          meta_.subfields = subfields as any

          if (flatten.includes(nested)) {
            Object.assign(resolved_, subfields)
          }

          break
        }

        default: {
          break
        }
      }

      const key_ = (flatten.length > 0 ? nestedKey : key) as keyof TResolvedFieldsMeta_

      if (!nested || !purge.includes(nested)) {
        resolved_[key_] = meta_ as unknown as TResolvedFieldsMeta_[keyof TResolvedFieldsMeta_]
      }
    }

    return resolved_
  }

  private resolveOptions(options: FieldsMetaOptions, defaults: ResolvedFieldsMetaOptions = {
    parentCircleReferences: true,
    fullNameFormatter: this.defaultFullNameFormatter,
  }): ResolvedFieldsMetaOptions {
    return {
      ...defaults,
      ...options,
    }
  }

  private defaultFullNameFormatter: ResolvedFieldsMetaOptions['fullNameFormatter'] = function (key, parent) {
    const parentFull = parent?.fullName
    const isParentFn = typeof parentFull === 'function'
    const getParent = (indices: number[] = []): string | undefined => isParentFn ? parentFull(...indices) : (parentFull)

    switch (parent?.nested) {
      case 'array': {
        // For array children, accept indices ordered outer-to-inner; consume the last (innermost) index here and forward the rest upstream.
        return (...indices: number[]) => {
          const current = indices.length ? indices[indices.length - 1] : undefined
          const rest = indices.slice(0, -1)
          const base = getParent(rest)!
          const idx = current ?? 'number'
          const prefix = `${base}[${idx}]`
          return `${prefix}.${key}`
        }
      }

      case 'object': {
        return (...indices: number[]) => {
          const base = getParent(indices)!
          return `${base}.${key}`
        }
      }

      default: {
        return (...indices: number[]) => getParent(indices) || key
      }
    }
  }
}

interface FieldsMetaOptions {
  /**
   * Whether to maintain parent circle references in resolved field meta.
   *
   * @default true
   */
  parentCircleReferences?: boolean
  /**
   * Formatter function for generating full field names.
   *
   * @default defaultFullNameFormatter
   */
  fullNameFormatter?: (name: string, parent?: ResolvedFieldMeta<any, any, any, any, any, any> | null) => ResolvedCommonFieldMeta<any, any, any>['fullName']
}

type ResolvedFieldsMetaOptions = Required<FieldsMetaOptions>
