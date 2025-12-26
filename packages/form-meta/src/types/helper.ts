import type { If, IsAny, IsNever, Merge, OptionalKeysOf, RequiredKeysOf, Simplify } from 'type-fest'

/**
 * Apply default options to a specified options object.
 *
 * Credit: [type-fest](https://github.com/sindresorhus/type-fest/blob/b3ecd07b5a88378a60ae3c3ef9c356ea06378211/source/internal/object.d.ts#L222-L233)
 */
export type ApplyDefaultOptions<
  Options extends object,
  Defaults extends Simplify<Omit<Required<Options>, RequiredKeysOf<Options>> & Partial<Record<RequiredKeysOf<Options>, never>>>,
  SpecifiedOptions extends Options,
>
  = If<IsAny<SpecifiedOptions>, Defaults, If<IsNever<SpecifiedOptions>, Defaults, Simplify<Merge<Defaults, {
    [Key in keyof SpecifiedOptions
    as Key extends OptionalKeysOf<Options> ? undefined extends SpecifiedOptions[Key] ? never : Key : Key
    ]: SpecifiedOptions[Key]
  }> & Required<Options>>>> // `& Required<Options>` ensures that `ApplyDefaultOptions<SomeOption, ...>` is always assignable to `Required<SomeOption>`

/**
 * Check whether an array includes a specific item.
 *
 * @example
  ```ts
    type Test1 = ArrayIncludes<['a', 'b', 'c'], 'b'> // true
    type Test2 = ArrayIncludes<['a', 'b', 'c'], 'd'> // false
  ```
 *
 */
export type ArrayIncludes<Arr extends readonly any[], Item> = Item extends Arr[number] ? true : false

/**
 * Join a prefix and a key into a dot-separated string.
 *
 * @example
  ```ts
    type Test1 = JoinPath<'user', 'name'> // 'user.name'
    type Test2 = JoinPath<'', 'age'> // 'age'
  ```
 *
 */
export type JoinPath<TPrefix extends string, TKey> = TPrefix extends ''
  ? TKey extends string | number
    ? `${TKey}`
    : never
  : TKey extends string | number
    ? `${TPrefix}.${TKey}`
    : never

/**
 * Get the string keys of a type.
 */
export type StringKeys<T> = Extract<keyof T, string>

/**
 * Convert a union type to an intersection type.
 *
 * @example
  ```ts
  type Test = UnionToIntersection<{ a: string } | { b: number }> // { a: string } & { b: number }
  ```
 *
 */
export type UnionToIntersection<U>
  = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

/**
 * Extract the function part of a type.
 */
export type FnPart<U> = U extends (...args: any[]) => any ? U : never
