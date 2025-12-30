<script lang='ts' generics="F extends TestResolvedFieldMeta<Array<TestResolvedFieldMeta>>">
  import type { TestResolvedFieldMeta } from '@/utils/form'
  import { getFormContext, getFormFieldArrayContext, setFormFieldArrayContext } from './form.context.ts'
  import FormField from './FormField.svelte'
  import FormFieldArray from './FormFieldArray.svelte'

  const props: {
    indices?: number[]
    field: F
  } = $props()

  const formContext = getFormContext()

  const formFieldArrayContext = getFormFieldArrayContext()

  const { removeValue, clearValues, pushValue, store } = formContext.form.createField(() => ({
    name: props.field.fullName(...(props.indices || [])),
    mode: 'array',
  }))

  const extends_ = $derived.by(() => {
    return typeof props.field.extends === 'function'
      ? props.field.extends({
        field: props.field,
        fields: formContext.fields,
        value: $store?.currentVal.value as unknown as any[],
        values: formContext.values,
        closestArrayValue: formFieldArrayContext.closestArrayValue,
        indices: props.indices || [],
      })
      : props.field.extends
  })

  setFormFieldArrayContext({
    get closestArrayValue() {
      return $store?.currentVal.value as unknown as any[]
    },
  })

</script>

<div
  class='component-form-field-array'
  style:grid-area={props.field.path.join('_')}
>
  <label>{extends_?.label ?? props.field.name}</label>

  <div class='component-form-field-array-items'>
    {#if !($store?.currentVal.value as [])?.length}
      <small>No items added.</small>
    {/if}

    {#each ($store?.currentVal.value as any[]) as _, idx (idx)}
      <div
        class={['component-form-field-array-item', `${props.field.path.join('_')}-item`]}
      >
        {#each Object.values(props.field.subfields!) as j (j!.name)}
          {#if j?.nested === 'array'}
            <FormFieldArray field={j!} indices={[...(props.indices || []), idx]} />
          {:else}
            <FormField field={j!} indices={[...(props.indices || []), idx]} />
          {/if}
        {/each}

        <button
          type='button'
          class='_remove'
          onclick={() => removeValue(idx)}
        >
          Remove
        </button>
      </div>
    {/each}
  </div>

  <button
    type='button'
    class='_clear'
    onclick={() => clearValues()}
  >
    Clear
  </button>

  <button
    type='button'
    class='_add'
    onclick={() => pushValue({} as never)}
  >
    Add
  </button>
</div>

<style lang='postcss'>
@import '@/assets/styles/form/form-field-array.pcss';
</style>
