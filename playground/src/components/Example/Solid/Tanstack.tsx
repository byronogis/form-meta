/** @jsxImportSource solid-js */

import type { TestFieldsData } from '@/utils/form'
import { createSignal } from 'solid-js'
import { Form } from '@/components/Solid/Tanstack/Form.tsx'
import { fm } from '@/utils/form'
import '@/assets/styles/example.pcss'

export function Tanstack() {
  const [data, setData] = createSignal<TestFieldsData>({
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

  return (
    <div class="not-content">
      <Form
        modelValue={data()}
        fields={fm}
        onUpdateModelValue={(value) => {
          setData(() => (value as TestFieldsData))
        }}
        onSubmit={handleSubmit}
      />

      <pre>{ JSON.stringify(data(), null, 2) }</pre>
    </div>
  )
}
