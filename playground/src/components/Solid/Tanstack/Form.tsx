/** @jsxImportSource solid-js */

import type { TestResolvedFieldMeta, TestResolvedFieldsMeta } from '@/utils/form'
import { createForm } from '@tanstack/solid-form'
import { createContext, createMemo, For, Index, mergeProps, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import '@/assets/styles/form/form.pcss'
import '@/assets/styles/form/form-field.pcss'
import '@/assets/styles/form/form-field-array.pcss'

const FormContext = createContext<[{
  form: ReturnType<typeof createForm>
  fields: TestResolvedFieldsMeta
  values: unknown
}]>([{}] as any)

const FormFieldArrayContext = createContext<[{
  closestArrayValue: unknown[]
}]>([{}] as any)

export function Form<FS extends TestResolvedFieldsMeta>(props: {
  fields: FS
  modelValue?: unknown
  onUpdateModelValue?: (value: unknown) => void
  onSubmit?: (value: unknown) => void
}) {
  // const fields = () => props.fields
  // const modelValue = () => (props.modelValue ?? {})

  const form = createForm(() => ({
    defaultValues: props.modelValue,
    onSubmit({ value }) {
      props.onSubmit?.(value)
    },
    listeners: {
      onChange(form) {
        props.onUpdateModelValue?.(form.formApi.state.values)
      },
    },
  }))

  const [value] = createStore({
    form,
    fields: props.fields,
    values: props.modelValue,
  })

  return (
    <FormContext.Provider value={[value]}>
      <form
        class="component-form"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <For each={Object.entries(props.fields)}>
          {([_, field]) => (
            field?.nested === 'array'
              ? (
                  <FormFieldArray field={field} />
                )
              : (
                  <FormField field={field!} />
                )
          )}
        </For>

        <button type="submit" style={{ 'grid-area': '_submit' }}>
          Submit
        </button>
      </form>
    </FormContext.Provider>
  )
}

export function FormField<F extends TestResolvedFieldMeta>(props: {
  indices?: number[]
  field: F
}) {
  const props_ = mergeProps({ indices: [] }, props)

  const [{ form, fields, values }] = useContext(FormContext)!
  const [{ closestArrayValue }] = useContext(FormFieldArrayContext)!

  const field = form.createField(() => ({
    name: props_.field.fullName(...props_.indices),
    validators: {
      onChange: props_.field.schema,
    },
  }))

  const extends_ = createMemo(() => (
    typeof props.field.extends === 'function'
      ? props.field.extends({
          field: props.field,
          fields,
          value: field().state.value,
          values,
          closestArrayValue,
          indices: props_.indices,
        })
      : props.field.extends
  ))

  return (
    <div
      class="component-form-field"
      style={{ 'grid-area': props.field.path.join('_') }}
    >
      <label for={props.field.name}>{extends_()?.label ?? props.field.name}</label>

      {props.field.type === 'input' && (
        <input
          id={props.field.name}
          value={field().state.value as any ?? ''}
          disabled={extends_()?.disabled}
          onInput={e => field().handleChange(e.currentTarget.value)}
        />
      )}

      {props.field.type === 'select' && (
        <select
          id={props.field.name}
          value={field().state.value as any}
          disabled={extends_()?.disabled}
          onChange={e => field().handleChange(e.currentTarget.value)}
        >
          <For each={extends_()?.options}>
            {option => (
              <option value={option.value}>
                {option.label}
              </option>
            )}

          </For>
        </select>
      )}

      <small>{field().state.meta.errors.map(i => i?.message).join(', ')}</small>

    </div>
  )
}

export function FormFieldArray<F extends TestResolvedFieldMeta<Array<TestResolvedFieldMeta>>>(props: {
  indices?: number[]
  field: F
}) {
  const props_ = mergeProps({ indices: [] }, props)

  const [{ form, fields, values }] = useContext(FormContext)!
  const [{ closestArrayValue }] = useContext(FormFieldArrayContext)!

  const field = form.createField(() => ({
    name: props_.field.fullName(...props_.indices),
    mode: 'array',
  }))

  const items = () => (field().state.value as unknown[] | undefined) ?? []

  const extends_ = createMemo(() => (
    typeof props_.field.extends === 'function'
      ? props_.field.extends({
          field: props_.field,
          fields,
          value: field().state.value as unknown as any[],
          values,
          closestArrayValue,
          indices: props_.indices || [],
        })
      : props_.field.extends
  ))

  return (
    <FormFieldArrayContext.Provider
      value={[{
        closestArrayValue: field().state.value as unknown[],
      }]}
    >
      <div
        class="component-form-field-array"
        style={{ 'grid-area': props.field.path.join('_') }}
      >
        <label>{extends_()?.label ?? props.field.name}</label>

        <div class="component-form-field-array-items">
          {!items().length && (
            <small>No items added.</small>
          )}

          <Index each={items()}>
            {(_, idx) => (
              <div
                class={[
                  'component-form-field-array-item',
                  `${props.field.path.join('_')}-item`,
                ].join(' ')}
              >
                <For each={Object.values(props.field.subfields ?? {})}>
                  {j => (
                    j?.nested === 'array'
                      ? (
                          <FormFieldArray
                            field={j!}
                            indices={[...(props.indices || []), idx]}
                          />
                        )
                      : (
                          <FormField
                            field={j!}
                            indices={[...(props.indices || []), idx]}
                          />
                        )
                  )}
                </For>

                <button
                  type="button"
                  class="_remove"
                  onClick={() => field().removeValue(idx)}
                >
                  Remove
                </button>
              </div>
            )}
          </Index>
        </div>

        <button
          type="button"
          class="_clear"
          onClick={() => field().clearValues()}
        >
          Clear
        </button>

        <button
          type="button"
          class="_add"
          onClick={() => field().pushValue({} as never)}
        >
          Add
        </button>

      </div>
    </FormFieldArrayContext.Provider>
  )
}
