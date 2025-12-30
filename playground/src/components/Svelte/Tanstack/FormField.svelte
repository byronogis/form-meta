<script lang='ts' generics="F extends TestResolvedFieldMeta">
  import type { TestResolvedFieldMeta } from '@/utils/form'
  import { getFormContext, getFormFieldArrayContext } from './form.context.ts'

  const props: {
    indices?: number[]
    field: F
  } = $props()

  const formContext = getFormContext()

  const formFieldArrayContext = getFormFieldArrayContext()

  const { setValue, store } = formContext.form.createField(() => ({
    name: props.field.fullName(...(props.indices || [])),
    validators: {
      onChange: props.field.schema,
    },
  }))

  const extends_ = $derived.by(() => {
    return typeof props.field.extends === 'function'
      ? props.field.extends({
        field: props.field,
        fields: formContext.fields,
        value: $store?.currentVal.value,
        values: formContext.values,
        closestArrayValue: formFieldArrayContext.closestArrayValue,
        indices: props.indices || [],
      })
      : props.field.extends
  })

</script>

<div
  class='component-form-field'
  style:grid-area={props.field.path.join('_')}
>
  <label for={props.field.name}>{extends_?.label ?? props.field.name}</label>

  {#if props.field.type === 'input'}
    <input
      id={props.field.name}
      value={$store?.currentVal.value}
      placeholder={extends_?.placeholder}
      disabled={extends_?.disabled}
      oninput={e => setValue((e.target as HTMLInputElement).value)}
    >
  {:else if props.field.type === 'select'}
    <select
      id={props.field.name}
      value={$store?.currentVal.value}
      disabled={extends_?.disabled}
      onchange={e => setValue((e.target as HTMLSelectElement).value)}
    >
      {#each extends_?.options as option (option.value)}
        <option
          value={option.value}
        >
          {option.label}
        </option>
      {/each}
    </select>
  {/if}

  <small>{$store?.currentVal.meta.errors.map(i => i?.message).join(', ')}</small>
</div>

<style lang='postcss'>
@import '@/assets/styles/form/form-field.pcss';
</style>
