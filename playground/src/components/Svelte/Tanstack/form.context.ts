import type { createForm } from '@tanstack/svelte-form'
import type { TestResolvedFieldsMeta } from '@/utils/form'
import { createContext } from 'svelte'

export const [getFormContext, setFormContext] = createContext<{
  form: ReturnType<typeof createForm>
  fields: TestResolvedFieldsMeta
  values: unknown
}>()

export const [getFormFieldArrayContext, setFormFieldArrayContext] = createContext<{
  closestArrayValue: unknown[]
}>()
