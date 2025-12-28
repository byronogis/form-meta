<script setup lang="ts">
import type { TestFieldsData } from '@/utils/form'
import { ref } from 'vue'
import Form from '@/components/Vue/Tanstack/Form.vue'
import { fm } from '@/utils/form'

const data = ref<TestFieldsData>({
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

<template>
  <div class="not-content">
    <Form
      v-model="data"
      :fields="fm"
      @submit="handleSubmit"
    />

    <pre>{{ data }}</pre>
  </div>
</template>

<style lang="postcss">
@import '@/assets/styles/example.pcss'
</style>
