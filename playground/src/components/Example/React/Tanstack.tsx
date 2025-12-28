import type { TestFieldsData } from '@/utils/form'
import React, { useState } from 'react'
import { Form } from '@/components/React/Tanstack/Form.tsx'
import { fm } from '@/utils/form'
import '@/assets/styles/example.pcss'

export function Tanstack() {
  const [data, setData] = useState<TestFieldsData>({
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
    <div className="not-content">
      <Form
        modelValue={data}
        fields={fm}
        onUpdateModelValue={(value) => {
          setData(value as TestFieldsData)
        }}
        onSubmit={handleSubmit}
      />

      <pre>{ JSON.stringify(data, null, 2) }</pre>
    </div>
  )
}
