---
title: FieldsMeta reference
description: API reference for form-meta's resolver and options.
---

## `new FieldsMeta<TFieldType, TFieldExtends>(options?)`

- `options.parentCircleReferences?` (default `true`): keep circular `parent` refs; turn off to avoid cycles.
- `options.fullNameFormatter?`: custom path generator `(name, parent?) => (...indices: number[]) => string`.

## `.resolve(raw, options?, parent?, resolved?)`

Parse `RawFieldsMeta` into `ResolvedFieldsMeta`.

Parameters:
- `raw`: `RawFieldsMeta<TFormData, TFieldType, TFieldExtends>`
- `options.flatten?`: `('object' | 'array')[]`; flatten these nested types with dotted keys.
- `options.purge?`: `('object' | 'array')[]`; remove these wrapper nodes (children can remain).
- `options.parentCircleReferences?`: same as constructor default.
- `options.fullNameFormatter?`: same as constructor override.

Returns: `ResolvedFieldsMeta`, fields include:
- `name`: original key.
- `path`: ancestor path array.
- `fullName(...indices: number[])`: path string supporting array indices.
- `parent`: parent field meta or `null`.
- `type` / `nested` / `subfields` / `schema` / `extends`: carried over and completed from input.

## Types

- `RawFieldsMeta<TFormData, TFieldType, TFieldExtends>`: input meta aligned to form shape.
- `ResolvedFieldsMeta<TRaw, TFieldType, TFieldExtends, TOptions>`: output meta; `TOptions` applies defaults `flatten: []`, `purge: []`.
- `ResolvedFieldMeta`: single field meta (primitive/array/object).

## Usage sketch

```ts
const fm = new FieldsMeta<'input' | 'select', { label?: string }>({
  parentCircleReferences: false,
})

const resolved = fm.resolve(rawFieldsMeta, {
  flatten: ['object', 'array'],
  purge: ['object'],
})

resolved['sections.heading'].fullName(1) // "sections[1].heading"
```
