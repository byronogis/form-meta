<script setup lang="ts" generic="F extends TestResolvedFieldMeta">
import type { useForm } from 'vee-validate'
import type { TestResolvedFieldMeta } from '@/utils/form'
import { useField } from 'vee-validate'
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

const { value, errorMessage, setValue } = useField(() => props.field.fullName(...props.indices), props.field.schema, {
  form,
})

const extends_ = computed(() => {
  return typeof props.field.extends === 'function'
    ? props.field.extends({
        field: props.field,
        fields: fields.value,
        value: value.value,
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
        :value="value"
        :placeholder="extends_?.placeholder"
        :disabled="extends_?.disabled"
        @input="(e) => setValue((e.target as HTMLInputElement).value)"
      >
    </template>

    <template v-else-if="field.type! === 'select'">
      <select
        :id="props.field.name"
        :value="value"
        :disabled="extends_?.disabled"
        @change="(e) => setValue((e.target as HTMLSelectElement).value)"
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

    <small>{{ errorMessage }}</small>
  </div>
</template>

<style scoped lang="postcss">
@import '@/assets/styles/form/form-field.pcss';
</style>
