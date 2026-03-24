<!--
  PasswordStrengthMeter - パスワード強度の簡易メーター

  utils/passwordStrength の結果をバーと文言で表示。未入力時は控えめに隠す。
-->
<template>
  <div
    class="password-strength"
    :aria-hidden="!password.length"
  >
    <div
      class="password-strength__track"
      role="presentation"
    >
      <div
        class="password-strength__fill"
        :class="`password-strength__fill--${level}`"
        :style="{ width: `${pct}%` }"
      />
    </div>
    <p
      :id="labelId"
      class="password-strength__label"
      aria-live="polite"
    >
      {{ label }}
    </p>
  </div>
</template>

<script setup lang="ts">
// ==========================================================================
// Imports
// ==========================================================================

import { evaluatePasswordStrength, type PasswordStrengthLevel } from '~/utils/passwordStrength'
import { computed } from 'vue'

// ==========================================================================
// Props
// ==========================================================================

const props = defineProps<{
  password: string
  labelId: string
}>()

// ==========================================================================
// Computed
// ==========================================================================

const result = computed(() => evaluatePasswordStrength(props.password))

const level = computed<PasswordStrengthLevel>(() => result.value.level)

const label = computed(() =>
  props.password.length ? result.value.label : 'パスワードを入力すると強度が表示されます',
)

const pct = computed(() => {
  const s = result.value.score
  if (!props.password.length) return 0
  return Math.min(100, Math.round((s / 5) * 100))
})
</script>

<style scoped lang="scss">
.password-strength {
  margin-top: var(--space-sm);
}

.password-strength__track {
  height: var(--space-sm);
  border-radius: 999px;
  background: var(--color-border-subtle);
  overflow: hidden;
}

.password-strength__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.25s ease, background-color 0.25s ease;
}

.password-strength__fill--weak {
  background: var(--color-password-weak);
}

.password-strength__fill--fair {
  background: var(--color-password-fair);
}

.password-strength__fill--good {
  background: var(--color-password-good);
}

.password-strength__fill--strong {
  background: var(--color-password-strong);
}

.password-strength__label {
  margin: var(--space-sm) 0 0;
  font-size: var(--font-size-hint);
  color: var(--color-text-muted);
}
</style>
