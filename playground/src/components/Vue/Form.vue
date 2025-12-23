<script setup lang="ts" generic="FS extends TestResolvedFieldsMeta">
import type { TestResolvedFieldsMeta } from '@/utils/form'
import { useForm } from '@tanstack/vue-form'
import { provide } from 'vue'
import FormField from './FormField.vue'
import FormFieldArray from './FormFieldArray.vue'

const props = withDefaults(defineProps<{
  fields: FS
}>(), {
  // ...
})

const emits = defineEmits<{
  submit: [value: unknown]
}>()

const form = useForm({
  // ...
  onSubmit({ value }) {
    emits('submit', value)
  },
})

provide('form', form)
</script>

<template>
  <form class="component-vue-form" @submit.prevent.stop="form.handleSubmit">
    <template
      v-for="field in props.fields"
      :key="field!.name"
    >
      <FormFieldArray
        v-if="field!.nested === 'array'"
        :field="(field! as any)"
      />

      <FormField
        v-else
        :field="field!"
      />
    </template>

    <button type="submit" style="grid-area: _submit;">
      Submit
    </button>
  </form>
</template>

<style scoped lang="postcss"></style>
