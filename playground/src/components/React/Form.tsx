import type { TestResolvedFieldMeta, TestResolvedFieldsMeta } from '@/utils/form'
import { useField, useForm } from '@tanstack/react-form'
import React, { createContext, use } from 'react'
import '@/assets/styles/form/form.pcss'
import '@/assets/styles/form/form-field.pcss'
import '@/assets/styles/form/form-field-array.pcss'

const FormContext = createContext<ReturnType<typeof useForm>>({} as any)

export function Form<FS extends TestResolvedFieldsMeta>(props: {
  fields: FS
  modelValue?: unknown
  onUpdateModelValue?: (value: unknown) => void
  onSubmit?: (value: unknown) => void
}) {
  const form = useForm({
    defaultValues: props.modelValue,
    onSubmit({ value }) {
      props.onSubmit?.(value)
    },
    listeners: {
      onChange(form) {
        props.onUpdateModelValue?.(form.formApi.state.values)
      },
    },
  })

  return (
    <FormContext value={form}>
      <form
        className="component-form"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        {
          Object.entries(props.fields).map(([_, field]) => (
            field?.nested === 'array'
              ? (
                  <FormFieldArray field={field} key={field.name} />
                )
              : (
                  <FormField field={field!} key={field!.name} />
                )
          ))
        }

        <button type="submit" style={{ gridArea: '_submit' }}>
          Submit
        </button>
      </form>
    </FormContext>
  )
}

export function FormField<F extends TestResolvedFieldMeta>({
  indices = [],
  field,
}: {
  indices?: number[]
  field: F
}) {
  const form = use(FormContext)

  const { state, handleChange } = useField({
    name: field.fullName(...indices),
    form,
    validators: {
      onChange: field.schema,
    },
  })

  return (
    <div
      className="component-form-field"
      style={{ gridArea: field.path.join('_') }}
    >
      <label htmlFor={field.name}>{field.extends?.label ?? field.name}</label>

      {field.type === 'input' && (
        <input
          id={field.name}
          value={state.value as any}
          onChange={e => handleChange(e.target.value)}
        />
      )}

      {field.type === 'select' && (
        <select
          id={field.name}
          value={state.value as any}
          onChange={e => handleChange(e.target.value)}
        >
          {field.extends?.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      <small>{state.meta.errors.map(i => i?.message).join(', ')}</small>

    </div>
  )
}

export function FormFieldArray<F extends TestResolvedFieldMeta<Array<TestResolvedFieldMeta>>>({
  indices = [],
  field,
}: {
  indices?: number[]
  field: F
}) {
  const form = use(FormContext)

  const { state, removeValue, pushValue, clearValues } = useField({
    name: field.fullName(...indices),
    form,
    mode: 'array',
  })

  return (
    <div
      className="component-form-field-array"
      style={{ gridArea: field.path.join('_') }}
    >
      <label>{field.extends?.label ?? field.name}</label>

      <div className="component-form-field-array-items">
        {!(state.value as [])?.length && (
          <small>No items added.</small>
        )}

        {(state.value as [])?.map((i, idx) => (
          <div
            className={[
              'component-form-field-array-item',
              `${field.path.join('_')}-item`,
            ].join(' ')}
            key={idx}
          >
            {Object.values(field.subfields ?? {}).map(j => (
              <React.Fragment key={j!.name}>
                {j?.nested === 'array'
                  ? (
                      <FormFieldArray field={j!} indices={[...indices, idx]} />
                    )
                  : (
                      <FormField field={j!} indices={[...indices, idx]} />
                    )}

                <button
                  type="button"
                  className="_remove"
                  onClick={() => removeValue(idx)}
                >
                  Remove
                </button>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="_clear"
        onClick={() => clearValues()}
      >
        Clear
      </button>

      <button
        type="button"
        className="_add"
        onClick={() => pushValue({} as never)}
      >
        Add
      </button>

    </div>
  )
}
