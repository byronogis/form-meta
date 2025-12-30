<script lang='ts'>
  import type { TestFieldsData } from '@/utils/form'
  import Form from '@/components/Svelte/Tanstack/Form.svelte'
  import { fm } from '@/utils/form'

  let data = $state<TestFieldsData>({
    title: '',
    subtitle: '',
    author: {
      name: 'Anonymous',
    },
    sections: [],
  })

  function handleSubmit(value: unknown): void {
    console.info('Form submitted with value:', value)
    // eslint-disable-next-line no-alert
    alert(`Form submitted with value: ${JSON.stringify(value, null, 2)}`)
  }
</script>

<div class='not-content'>
  <Form
    modelValue={data}
    fields={fm}
    onSubmit={handleSubmit}
    onUpdateModelValue={(value) => {
      data = value as TestFieldsData
    }}
  />

  <pre>{JSON.stringify(data, null, 2)}</pre>
</div>

<style lang='postcss'>
  :global {
    @import '@/assets/styles/example.pcss';
  }
</style>
