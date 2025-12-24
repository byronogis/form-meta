<script setup lang="ts">
import type { TestFieldsData } from '@/utils/form'
import { ref } from 'vue'
import Form from '@/components/Vue/Form.vue'
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

    <pre class="text-sm mt-6 p-4 border border-gray-300 rounded bg-gray-50">{{ data }}</pre>
  </div>
</template>

<style scoped lang="postcss">
:deep(.component-vue-form) {
  grid-template:
    'title            title                title                   title            ' auto
    'subtitle         subtitle             subtitle                subtitle         ' auto
    'author_name      author_profileUrl    author_profileUrl       author_profileUrl' auto
    'sections         sections             sections                sections         ' auto
    'layout_blocks    layout_blocks        layout_blocks           layout_blocks    ' auto
    '_clear           _reset               _submit                 _submit           ' auto / 1fr 1fr 1fr 1fr;
}

:deep(.component-vue-form .component-vue-form-field-array-item) {
  &.sections-item {
    grid-template:
      'sections_heading   sections_paragraphs   _remove' auto / 1fr 2.5fr auto;
  }

  &.sections_paragraphs-item {
    grid-template:
      'sections_paragraphs_text  sections_paragraphs_footnote   _remove' auto / 1fr 1fr auto;
  }

  &.layout_blocks-item {
    grid-template:
      'layout_blocks_blockType   layout_blocks_components  _remove' auto / 1fr 2.5fr auto;
  }

  &.layout_blocks_components-item {
    grid-template:
      'layout_blocks_components_componentType  layout_blocks_components_config_enabled  _remove' auto / 1fr 1fr auto;
  }

}
</style>
