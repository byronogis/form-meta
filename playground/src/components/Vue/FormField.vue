<script setup lang="ts" generic="F extends TestResolvedFieldMeta">
import type { useForm } from '@tanstack/vue-form'
import type { TestResolvedFieldMeta } from '@/utils/form'
import { useField } from '@tanstack/vue-form'
import { inject } from 'vue'

const props = withDefaults(defineProps<{
  indices?: number[]
  field: F
}>(), {
  indices: () => [],
})

const form = inject<ReturnType<typeof useForm>>('form', {} as any)

const { api, state } = useField({
  name: props.field.fullName(...props.indices),
  form,
})
</script>

<template>
  <div
    class="component-vue-from-field"
    :style="[{ 'grid-area': props.field.path.join('_') }]"
  >
    <label :for="props.field.name" class="mb-3 block font-bold">{{ props.field.extends?.label ?? props.field.name }}</label>

    <template v-if="field.type! === 'input'">
      <input
        :id="props.field.name"
        :value="state.value"
        :placeholder="props.field.extends?.placeholder"
        class="w-full rounded border border-gray-300 px-3 py-2"
        @input="(e) => api.setValue((e.target as HTMLInputElement).value)"
      >
    </template>

    <template v-else-if="field.type! === 'select'">
      <select
        :id="props.field.name"
        :value="state.value"
        class="w-full rounded border border-gray-300 px-3 py-2"
        @change="(e) => api.setValue((e.target as HTMLSelectElement).value)"
      >
        <option
          v-for="option in props.field.extends?.options ?? []"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </template>

    <!-- <small class="text-red-500">{{ state.meta.errors }}</small> -->
  </div>
</template>

<style scoped lang="postcss">
  .component-vue-from-field {
    display: flex;
    flex-direction: column;
  }
</style>
