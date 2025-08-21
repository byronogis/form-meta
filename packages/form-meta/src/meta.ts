import type {
  FieldMeta,
  FieldsMeta,
  ResolvedFieldMeta,
  ResolvedFieldsMeta,
} from './type'

export function defineFieldsMeta<
  TFormData,
  TFieldType,
  TFieldExtends,
>(
  meta: FieldsMeta<TFormData, TFieldType, TFieldExtends>,
): FieldsMeta<TFormData, TFieldType, TFieldExtends> {
  return meta
}

export function resolveFieldsMeta<
  TFormData,
  TFieldType,
  TFieldExtends,
  _TFieldsMeta extends FieldsMeta<TFormData, TFieldType, TFieldExtends> = FieldsMeta<TFormData, TFieldType, TFieldExtends>,
  _TReturn extends ResolvedFieldsMeta<TFormData, TFieldType, TFieldExtends> = ResolvedFieldsMeta<TFormData, TFieldType, TFieldExtends>,
>(
  meta: _TFieldsMeta,
  options?: any,
  parentPath?: string,
  resolvedFieldsMeta: _TReturn = {} as _TReturn,
): _TReturn {
  (Object.keys(meta) as Array<keyof TFormData & string>).forEach((key) => {
    const fieldMeta = meta[key]
    const currentPath = parentPath ? `${parentPath}.${String(key)}` : String(key)

    switch ((fieldMeta).nested) {
      case 'array':
        ;(resolvedFieldsMeta as any)[currentPath] = resolveFieldsMeta(fieldMeta.subfields, options, `${currentPath}[number]`)
        break

      case 'object':
        resolveFieldsMeta(fieldMeta.subfields, options, currentPath, resolvedFieldsMeta)
        break

      default:
        {
          const _meta = resolveFieldMeta(fieldMeta, key, parentPath)
          ;(resolvedFieldsMeta as any)[_meta.fullName] = _meta
        }
        break
    }
  })

  return resolvedFieldsMeta
}

export function resolveFieldMeta<
  TFieldKey,
  TFieldValue,
  TFieldType,
  TFieldExtends,
  _TReturn extends ResolvedFieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends> = ResolvedFieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends>,
>(
  meta: FieldMeta<TFieldKey, TFieldValue, TFieldType, TFieldExtends>,
  key?: TFieldKey,
  parentPath?: string,
): _TReturn {
  const resolvedFieldMeta = structuredClone(meta) as _TReturn

  resolvedFieldMeta.name ??= key

  const fieldName = String(resolvedFieldMeta.name ?? '')
  const fullName = parentPath ? `${parentPath}.${fieldName}` : fieldName

  resolvedFieldMeta.fullName = fullName

  return resolvedFieldMeta
}
