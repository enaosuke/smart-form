<!--
  BaseCheckbox - カスタム見た目のチェックボックス

  実 input は視覚的に隠し、ラベル＋枠で操作。スロットに同意文などを渡す。
-->
<template>
  <div
    class="base-checkbox"
    :class="{ 'base-checkbox--error': hasError }"
    :data-field-root="name"
  >
    <input
      :id="inputId"
      class="base-checkbox__input"
      type="checkbox"
      :name="name"
      :checked="modelValue"
      :disabled="disabled"
      :required="required"
      :aria-invalid="ariaInvalid"
      :aria-describedby="describedBy"
      :aria-required="required ? 'true' : undefined"
      v-bind="extraAttrs"
      @change="onChange"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    >
    <label
      class="base-checkbox__label"
      :for="inputId"
    >
      <span
        class="base-checkbox__box"
        aria-hidden="true"
      />
      <span class="base-checkbox__text">
        <slot />
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
// ==========================================================================
// Imports
// ==========================================================================

import { computed, useAttrs } from 'vue'

// ==========================================================================
// Props
// ==========================================================================

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    name: string
    inputId: string
    disabled?: boolean
    required?: boolean
    hasError?: boolean
    ariaInvalid?: boolean | 'true' | 'false'
    describedBy?: string
  }>(),
  {
    hasError: false,
    ariaInvalid: false,
  },
)

// ==========================================================================
// Emits
// ==========================================================================

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

// ==========================================================================
// Computed
// ==========================================================================

const attrs = useAttrs()
const extraAttrs = computed(() => {
  const { class: _c, ...rest } = attrs as Record<string, unknown>
  return rest
})

// ==========================================================================
// Methods
// ==========================================================================

function onChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).checked)
}
</script>

<style scoped lang="scss">
.base-checkbox {
  position: relative;
  display: block;
}

.base-checkbox__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;

  &:focus-visible + .base-checkbox__label .base-checkbox__box {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  &:checked + .base-checkbox__label .base-checkbox__box {
    background-color: var(--color-text-primary);
    border-color: var(--color-text-primary);
  }

  &:checked + .base-checkbox__label .base-checkbox__box::after {
    opacity: 1;
    transform: rotate(45deg) scale(1);
  }
}

.base-checkbox__label {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  cursor: pointer;
  font-size: var(--font-size-label);
  color: var(--color-text-primary);
  line-height: 1.45;
}

.base-checkbox__box {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  /* 1行目の行ボックスの中央と 22px 角の中央を揃える（label の 1em・line-height に追従） */
  margin-top: calc(0.5em * 1.45 - 11px);
  border: 2px solid var(--color-text-primary);
  border-radius: var(--space-sm);
  background: var(--color-input-bg);
  position: relative;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &::after {
    content: '';
    position: absolute;
    left: 6px;
    top: 2px;
    width: 6px;
    height: 11px;
    border: solid var(--color-accent-contrast);
    border-width: 0 2px 2px 0;
    opacity: 0;
    transform: rotate(45deg) scale(0.5);
    transition: opacity 0.15s ease, transform 0.15s ease;
  }
}

.base-checkbox--error .base-checkbox__box {
  border-color: var(--color-border-error);
}

.base-checkbox__text {
  flex: 1;
  min-width: 0;
}
</style>
