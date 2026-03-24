<!--
  FormFieldShell - vee-validate Field の薄いラッパー

  スロットへ showError / showSuccess を渡し、data-invalid でスクロール先を付ける。
-->
<template>
  <Field
    v-slot="ctx"
    :name="name"
  >
    <div
      class="form-field-shell"
      :data-invalid="vis(ctx).showError ? 'true' : undefined"
    >
      <slot
        :field="ctx.field"
        :error-message="ctx.errorMessage"
        :meta="ctx.meta"
        :show-error="vis(ctx).showError"
        :show-success="vis(ctx).showSuccess"
      />
    </div>
  </Field>
</template>

<script setup lang="ts">
// ==========================================================================
// Imports
// ==========================================================================

import { Field, useFormContext } from 'vee-validate'
import type { FieldMeta } from 'vee-validate'

// ==========================================================================
// Props
// ==========================================================================

defineProps<{
  name: string
}>()

// ==========================================================================
// Composables
// ==========================================================================

const { submitCount } = useFormContext()

// ==========================================================================
// Methods
// ==========================================================================

interface SlotCtx {
  meta: FieldMeta<unknown>
  errorMessage?: string | null
}

function vis(ctx: SlotCtx) {
  const msg = ctx.errorMessage
  const meta = ctx.meta
  // 送信後または touched 後は、dirty でなくてもエラーを出す（必須未入力など）
  const showError = !!(msg && (submitCount.value > 0 || meta.touched))
  const showSuccess =
    !msg &&
    meta.valid &&
    (submitCount.value > 0 || (meta.touched && meta.dirty))
  return { showError, showSuccess }
}
</script>

