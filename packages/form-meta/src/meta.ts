import type { SetRequiredDeep } from 'type-fest'
import type {
  RawFieldsMeta,
  ResolvedFieldsMeta,
} from './type'
import { cloneDeepWith, toMerged } from 'es-toolkit'

/**
 * Options for configuring the FieldsMeta class.
 */
interface FieldsMetaOptions {
  /**
   * The base path for resolving field names.
   * Defaults to an empty string.
   */
  basePath?: string
}

/**
 * Resolved options for FieldsMeta, ensuring basePath is always present.
 */
type ResolvedFieldsMetaOptions = SetRequiredDeep<FieldsMetaOptions, 'basePath'>

/**
 * A class for managing and resolving form field metadata.
 * It handles flattening nested structures and generating full paths for fields.
 */
export class FieldsMeta<
  TFieldType,
  TFieldExtends,
> {
  /**
   * The resolved options for this instance.
   */
  options: ResolvedFieldsMetaOptions

  /**
   * Constructs a new FieldsMeta instance with the given options.
   */
  constructor(options: FieldsMetaOptions = {}) {
    this.options = toMerged({
      basePath: '',
    }, options)
  }

  /**
   * Resolves raw field metadata into a flattened structure with full paths.
   */
  resolve<
    TFormData,
    _TRawFieldsMeta extends RawFieldsMeta<TFormData, TFieldType, TFieldExtends> = RawFieldsMeta<TFormData, TFieldType, TFieldExtends>,
    _TResolvedFieldsMeta extends ResolvedFieldsMeta<_TRawFieldsMeta, TFieldType, TFieldExtends> = ResolvedFieldsMeta<_TRawFieldsMeta, TFieldType, TFieldExtends>,
  >(
    raw: _TRawFieldsMeta,
    options: FieldsMetaOptions = {},
  ): _TResolvedFieldsMeta {
    return this._resolve<
      TFormData,
      _TRawFieldsMeta,
      _TResolvedFieldsMeta
    >(raw, toMerged(this.options, options))
  }

  /**
   * Private method to recursively resolve field metadata.
   */
  private _resolve<
    TFormData,
    _TRawFieldsMeta extends RawFieldsMeta<TFormData, TFieldType, TFieldExtends> = RawFieldsMeta<TFormData, TFieldType, TFieldExtends>,
    _TResolvedFieldsMeta extends ResolvedFieldsMeta<_TRawFieldsMeta, TFieldType, TFieldExtends> = ResolvedFieldsMeta<_TRawFieldsMeta, TFieldType, TFieldExtends>,
  >(
    metas: _TRawFieldsMeta,
    options: ResolvedFieldsMetaOptions = this.options,
    resolvedFieldsMeta: _TResolvedFieldsMeta = {} as _TResolvedFieldsMeta,
  ): _TResolvedFieldsMeta {
    const {
      basePath = '',
    } = options

    ;(Object.keys(metas) as Array<keyof TFormData & string>).forEach((key) => {
      const meta = metas[key]
      const currentPath = basePath ? `${basePath}.${String(key)}` : String(key)

      /**
       * Helper function to resolve basic field metadata.
       */
      function _resolveBasic(): any {
        const resolvedFieldMeta = cloneDeepWith(meta, (v, k, _o, stack) => {
          // Directly return the schema without cloning
          if (k === 'schema' && stack.size === 1) {
            return v
          }
        })

        return toMerged(resolvedFieldMeta, {
          name: key,
          fullName: currentPath,
        })
      }

      switch (meta.nested) {
        case 'array':
          {
            const _meta = _resolveBasic()
            if ('subfields' in meta && meta.subfields) {
              _meta.subfields = this._resolve(
                meta.subfields as any,
                toMerged(options, { basePath: `${currentPath}[number]` }),
              )
            }
            ;(resolvedFieldsMeta as any)[currentPath] = _meta
          }
          break

        case 'object':
          if ('subfields' in meta && meta.subfields) {
            // For object type, directly merge subfields into the current resolvedFieldsMeta
            const subResult = this._resolve(
              meta.subfields as any,
              toMerged(options, { basePath: currentPath }),
            )
            Object.assign(resolvedFieldsMeta, subResult)
          }
          break

        default:
          {
            const _meta = _resolveBasic()
            ;(resolvedFieldsMeta as any)[_meta.fullName] = _meta
          }
          break
      }
    })

    return resolvedFieldsMeta
  }
}
