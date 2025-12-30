<script lang='ts' generics="FS extends TestResolvedFieldsMeta">
  import type { TestResolvedFieldsMeta } from '@/utils/form'
  import { createForm } from '@tanstack/svelte-form'
  import { setFormContext, setFormFieldArrayContext } from './form.context.ts'
  import FormField from './FormField.svelte'
  import FormFieldArray from './FormFieldArray.svelte'

  const props: {
    fields: FS
    modelValue?: unknown
    onUpdateModelValue?: (value: unknown) => void
    onSubmit?: (value: unknown) => void
  } = $props()

  const form = createForm(() => ({
    // ...
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

  setFormContext({
    form,
    get fields() {
      return props.fields
    },
    get values() {
      return props.modelValue
    },
  })
  setFormFieldArrayContext({
    get closestArrayValue() {
      return []
    },
  })

</script>

<form class='component-form' onsubmit={(e) => {
  e.preventDefault()
  e.stopPropagation()
  form.handleSubmit()
}}>
  {#each Object.values(props.fields) as field (field!.name)}
    {#if field!.nested === 'array'}
      <FormFieldArray
        field={field!}
      />
    {:else}
      <FormField
        field={field!}
      />
    {/if}

  {/each}

  <!-- <button class="btn-red" style="grid-area: _clear;" @click="form.reset(undefined, { keepDefaultValues: false })">
      Clear
    </button>

    <button class="btn-yellow" style="grid-area: _reset;" @click="form.reset(undefined, { keepDefaultValues: true })">
      Reset
    </button> -->

  <button type='submit' style='grid-area: _submit;'>
    Submit
  </button>
</form>

<style lang='postcss'>
@import '@/assets/styles/form/form.pcss'
</style>
