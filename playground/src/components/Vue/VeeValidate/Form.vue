<script setup lang="ts" generic="FS extends TestResolvedFieldsMeta">
import type { TestResolvedFieldsMeta } from '@/utils/form'
import { useForm } from 'vee-validate'
import { computed, provide, watch } from 'vue'
import FormField from './FormField.vue'
import FormFieldArray from './FormFieldArray.vue'

const props = withDefaults(defineProps<{
  fields: FS
  modelValue?: unknown
}>(), {
  // ...
})

const emits = defineEmits<{
  'update:model-value': [value: unknown]
  'submit': [value: unknown]
}>()

const form = useForm({
  initialValues: props.modelValue as Record<string, unknown> | undefined,
})

const onSubmit = form.handleSubmit(
  (values) => {
    emits('submit', values)
  },
)

watch(() => form.values, (newValues) => {
  emits('update:model-value', newValues)
}, { deep: true })

provide('form', form)
provide('fields', computed(() => props.fields))
provide('values', computed(() => props.modelValue))
</script>

<template>
  <form class="component-form" @submit.prevent.stop="onSubmit">
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

    <!-- <button class="btn-red" style="grid-area: _clear;" @click="form.reset(undefined, { keepDefaultValues: false })">
      Clear
    </button>

    <button class="btn-yellow" style="grid-area: _reset;" @click="form.reset(undefined, { keepDefaultValues: true })">
      Reset
    </button> -->

    <button type="submit" style="grid-area: _submit;">
      Submit
    </button>
  </form>
</template>

<style scoped lang="postcss">
@import '@/assets/styles/form/form.pcss'
</style>
