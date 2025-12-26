<script setup lang="ts" generic="F extends TestResolvedFieldMeta<Array<TestResolvedFieldMeta>>">
import type { useForm } from '@tanstack/vue-form'
import type { TestResolvedFieldMeta } from '@/utils/form'
import { useField } from '@tanstack/vue-form'
import { computed, inject, provide, ref } from 'vue'
import FormField from './FormField.vue'
import FormFieldArray from './FormFieldArray.vue'

const props = withDefaults(defineProps<{
  indices?: number[]
  field: F
}>(), {
  indices: () => [],
})

const form = inject<ReturnType<typeof useForm>>('form', {} as any)
const _values = inject<any>('values', ref({}))

const { state, api } = useField({
  name: props.field.fullName(...props.indices),
  form,
  // defaultValue: props.field.extends?.defaultValue,
  mode: 'array',
})

provide('arrayValue', computed(() => state.value.value))
</script>

<template>
  <div
    class="component-form-field-array"
    :style="[{ 'grid-area': props.field.path.join('_') }]"
  >
    <label>{{ props.field.extends?.label ?? props.field.name }}</label>

    <div class="component-form-field-array-items">
      <template v-if="!(state.value as [])?.length">
        <small>No items added.</small>
      </template>

      <div
        v-for="(i, idx) in state.value"
        :key="idx"
        class="component-form-field-array-item"
        :class="[`${props.field.path.join('_')}-item`]"
      >
        <template v-for="j in field.subfields" :key="j!.name">
          <template v-if="j?.nested === 'array'">
            <FormFieldArray :field="j!" :indices="[...props.indices, idx]" />
          </template>

          <template v-else>
            <FormField :field="j!" :indices="[...props.indices, idx]" />
          </template>
        </template>

        <button
          type="button"
          class="_remove"
          label="Remove"
          @click="api.removeValue(idx)"
        >
          Remove
        </button>
      </div>
    </div>

    <button
      type="button"
      class="_clear"
      @click="api.clearValues()"
    >
      Clear
    </button>

    <button
      type="button"
      class="_add"
      @click="api.pushValue({} as never)"
    >
      Add
    </button>
  </div>
</template>

<style scoped lang="postcss">
@import '@/assets/styles/form/form-field-array.pcss';
</style>
