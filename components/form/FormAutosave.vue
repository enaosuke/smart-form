<!--
  FormAutosave - 下書きの LocalStorage 同期（見た目なし）

  マウント時にストレージから復元し、値の変更は composables/useForm でデバウンス保存する。
-->
<template>
  <span
    class="form-autosave"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
// ==========================================================================
// Imports
// ==========================================================================

import type { Ref } from 'vue'
import { onMounted } from 'vue'
import { useFormContext, useFormValues } from 'vee-validate'
import { defaultRegistrationValues } from '~/constants/defaultRegistrationValues'
import {
  parseRegistrationDraftFromStorage,
  pickSanitizedRegistrationDraft,
  useForm,
} from '~/composables/useForm'
import type { RegistrationFormValues } from '~/schemas/registrationSchema'

// ==========================================================================
// Composables & persistence
// ==========================================================================

const { setValues } = useFormContext<RegistrationFormValues>()
const values = useFormValues() as unknown as Ref<Record<string, unknown>>
useForm(values)

// ==========================================================================
// Lifecycle
// ==========================================================================

onMounted(() => {
  const draft = parseRegistrationDraftFromStorage()
  if (!draft) return
  const picked = pickSanitizedRegistrationDraft(draft)
  setValues({
    ...defaultRegistrationValues,
    ...picked,
  } as RegistrationFormValues)
})
</script>

<style scoped lang="scss">
.form-autosave {
  display: none;
}
</style>
