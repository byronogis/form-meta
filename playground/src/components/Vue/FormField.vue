<script setup lang="ts" generic="F extends TestResolvedFieldMeta">
import type { useForm } from '@tanstack/vue-form'
import type { TestResolvedFieldMeta } from '@/utils/form'
import { useField } from '@tanstack/vue-form'
import { computed, inject, ref } from 'vue'

const props = withDefaults(defineProps<{
  indices?: number[]
  field: F
}>(), {
  indices: () => [],
})

const form = inject<ReturnType<typeof useForm>>('form', {} as any)
const fields = inject<any>('fields', ref({}))
const values = inject<any>('values', ref({}))
const closestArrayValue = inject<any>('closestArrayValue', ref(undefined))

const { api, state } = useField({
  name: props.field.fullName(...props.indices),
  form,
  // defaultValue: props.field.extends?.defaultValue,
  validators: {
    onChange: props.field.schema,
  },
})

const extends_ = computed(() => {
  return typeof props.field.extends === 'function'
    ? props.field.extends({
        field: props.field,
        fields: fields.value,
        value: state.value,
        values: values.value,
        closestArrayValue: closestArrayValue?.value,
        indices: props.indices,
      })
    : props.field.extends
})
</script>

<template>
  <div
    class="component-form-field"
    :style="[{ 'grid-area': props.field.path.join('_') }]"
  >
    <label :for="props.field.name">{{ extends_?.label ?? props.field.name }}</label>

    <template v-if="field.type! === 'input'">
      <input
        :id="props.field.name"
        :value="state.value"
        :placeholder="extends_?.placeholder"
        :disabled="extends_?.disabled"
        @input="(e) => api.setValue((e.target as HTMLInputElement).value)"
      >
    </template>

    <template v-else-if="field.type! === 'select'">
      <select
        :id="props.field.name"
        :value="state.value"
        :disabled="extends_?.disabled"
        @change="(e) => api.setValue((e.target as HTMLSelectElement).value)"
      >
        <option
          v-for="option in extends_?.options ?? []"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </template>

    <small>{{ state.meta.errors.map(i => i?.message).join(', ') }}</small>
  </div>
</template>

<style scoped lang="postcss">
@import '@/assets/styles/form/form-field.pcss';
</style>
