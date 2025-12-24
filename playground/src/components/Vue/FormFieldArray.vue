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
  // defaultValue: props.field.extends?.defaultValue,
  mode: 'array',
})
</script>

<template>
  <div
    class="component-vue-form-field-array"
    :style="[{ 'grid-area': props.field.path.join('_') }]"
  >
    <label class="font-bold grid-area-[\_label] self-center">{{ props.field.extends?.label ?? props.field.name }}</label>

    <div class="grid-area-[\_items] border border-base rounded p-2 gap-2 space-y-2">
      <template v-if="!(state.value as [])?.length">
        <small class="text-gray-500 text-center w-full block">No items added.</small>
      </template>

      <div
        v-for="(i, idx) in state.value"
        :key="idx"
        class="component-vue-form-field-array-item grid gap-2 items-start"
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
          class="grid-area-[\_remove] self-end btn-red"
          label="Remove"
          @click="api.removeValue(idx)"
        >
          Remove
        </button>
      </div>
    </div>

    <button
      type="button"
      class="grid-area-[\_clear] btn-red"
      @click="api.clearValues()"
    >
      Clear
    </button>

    <button
      type="button"
      class="grid-area-[\_add] btn-blue"
      @click="api.pushValue({} as never)"
    >
      Add
    </button>
  </div>
</template>

<style scoped lang="postcss">
.component-vue-form-field-array {
  display: grid;
  gap: 0.5rem;
  grid-template:
    '_label _clear _add  ' 2rem
    '_items _items _items' auto / 1fr auto auto;
}
</style>
