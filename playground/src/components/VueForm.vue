<script setup lang="ts">
import Form from '@/components/Vue/Form.vue'
import { fm } from '@/utils/form'

console.log({ fm })

function handleSubmit(value: unknown): void {
  console.info('Form submitted with value:', value)
}
</script>

<template>
  <div class="not-content">
    <Form :fields="fm" @submit="handleSubmit" />
  </div>
</template>

<style scoped lang="postcss">
:deep(.component-vue-form) {
  display: grid;
  grid-template:
    'title            subtitle                                  _       _' auto
    'author_name      author_profileUrl                         _       _' auto
    'sections         sections             sections          sections     ' auto
    'layout_blocks    layout_blocks        layout_blocks     layout_blocks' auto
    '_submit _submit _submit _submit' auto / 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: start;
}

:deep(.component-vue-form .component-vue-form-field-array-item) {
  display: grid;
  gap: 1rem;
  align-items: start;

  &.sections-item {
    grid-template:
      'sections_heading   sections_paragraphs   _remove' auto / 1fr 1fr auto;
  }

  &.sections_paragraphs-item {
    grid-template:
      'sections_paragraphs_text  sections_paragraphs_footnote   _remove' auto / 1fr 1fr auto;
  }

  &.layout_blocks-item {
    grid-template:
      'layout_blocks_blockType   layout_blocks_components  _remove' auto / 1fr 1fr auto;
  }

  &.layout_blocks_components-item {
    grid-template:
      'layout_blocks_components_componentType  layout_blocks_components_config_enabled  _remove' auto / 1fr auto;
  }

}
</style>
