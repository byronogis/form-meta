---
title: FieldsMeta 参考
description: form-meta 解析器与选项的 API 说明。
---

## `new FieldsMeta<TFieldType, TFieldExtends>(options?)`

- `options.parentCircleReferences?`（默认 `true`）：是否保留 `parent` 的循环引用；关闭时会浅拷贝避免循环。
- `options.fullNameFormatter?`：自定义路径生成 `(name, parent?) => (...indices: number[]) => string`。

## `.resolve(raw, options?, parent?, resolved?)`

将 `RawFieldsMeta` 解析为 `ResolvedFieldsMeta`。

参数：
- `raw`: `RawFieldsMeta<TFormData, TFieldType, TFieldExtends>`
- `options.flatten?`: `('object' | 'array')[]`，展开这些嵌套类型，键使用点路径。
- `options.purge?`: `('object' | 'array')[]`，移除这些嵌套节点（子字段可保留）。
- `options.parentCircleReferences?`: 同上。
- `options.fullNameFormatter?`: 同上。

返回：`ResolvedFieldsMeta`，每个字段包含：
- `name`：原始键名。
- `path`：祖先路径数组。
- `fullName(...indices: number[])`：可插入数组索引的路径字符串。
- `parent`：父字段 meta（或 null）。
- `type` / `nested` / `subfields` / `schema` / `extends`：与输入对应并补充。

## 类型

- `RawFieldsMeta<TFormData, TFieldType, TFieldExtends>`：表单数据形状对应的 meta 输入类型。
- `ResolvedFieldsMeta<TRaw, TFieldType, TFieldExtends, TOptions>`：解析输出类型，`TOptions` 应用默认 `flatten: []`、`purge: []`。
- `ResolvedFieldMeta`：单字段 meta，可能是 primitive/array/object。

## 用法示例

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
