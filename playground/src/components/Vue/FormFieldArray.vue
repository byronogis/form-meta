<script setup lang="ts" generic="F extends TestResolvedFieldMeta<Array<TestResolvedFieldMeta>>">
import type { useForm } from '@tanstack/vue-form'
import type { TestResolvedFieldMeta } from '@/utils/form'
import { useField } from '@tanstack/vue-form'
import { inject } from 'vue'
import FormField from './FormField.vue'
import FormFieldArray from './FormFieldArray.vue'

const props = withDefaults(defineProps<{
  indices?: number[]
  field: F
}>(), {
  indices: () => [],
})

const form = inject<ReturnType<typeof useForm>>('form', {} as any)

const { state, api } = useField({
  name: props.field.fullName(...props.indices),
  form,
})
</script>

<template>
  <div
    class="component-vue-form-field-array"
    :style="[{ 'grid-area': props.field.path.join('_') }]"
  >
    <template
      v-for="(i, idx) in state.value"
      :key="idx"
    >
      <div
        class="component-vue-form-field-array-item gap-6"
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
          :style="[{ 'grid-area': '_remove' }]"
          label="Remove"
          @click="api.removeValue(idx)"
        >
          Remove
        </button>
      </div>
    </template>

    <button
      class="component-primo-form-field-array-add"
      label="Add"
      severity="secondary"
      @click="api.pushValue({} as never)"
    >
      Add
    </button>
  </div>
</template>

<style scoped lang="postcss">
  .component-vue-form-field-array {

  }
</style>
