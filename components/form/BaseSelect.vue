<!--
  BaseSelect - ネイティブ select のラッパー

  プレースホルダー用の空 option と、modelValue が undefined のときの表示ズレ対策を内包。
-->
<template>
  <div
    class="base-select"
    :class="rootClasses"
    :data-field-root="name"
  >
    <select
      :id="selectId"
      class="base-select__control"
      :class="controlClasses"
      :name="name"
      :value="selectBoundValue"
      :disabled="disabled"
      :required="required"
      :aria-invalid="ariaInvalid"
      :aria-describedby="describedBy"
      :aria-required="required ? 'true' : undefined"
      v-bind="extraAttrs"
      @change="onChange"
      @blur="onBlur"
      @focus="onFocus"
    >
      <!-- disabled にすると value="" が選べず、先頭の有効 option が表示されるブラウザがある -->
      <option
        v-if="placeholder"
        value=""
      >
        {{ placeholder }}
      </option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
// ==========================================================================
// Imports
// ==========================================================================

import { computed, ref, useAttrs } from 'vue'

export interface SelectOption {
  value: string
  label: string
}

// ==========================================================================
// Props
// ==========================================================================

const props = withDefaults(
  defineProps<{
    /** 未選択は '' または undefined/null（後者は空オプションとバインドが合わず先頭項目が表示されるのを防ぐ） */
    modelValue: string | undefined | null
    name: string
    selectId: string
    options: SelectOption[]
    placeholder?: string
    disabled?: boolean
    required?: boolean
    hasError?: boolean
    showSuccess?: boolean
    ariaInvalid?: boolean | 'true' | 'false'
    describedBy?: string
  }>(),
  {
    hasError: false,
    showSuccess: false,
    ariaInvalid: false,
  },
)

// ==========================================================================
// Emits
// ==========================================================================

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

// ==========================================================================
// State
// ==========================================================================

const attrs = useAttrs()
const focused = ref(false)

// ==========================================================================
// Computed
// ==========================================================================

const extraAttrs = computed(() => {
  const { class: _c, ...rest } = attrs as Record<string, unknown>
  return rest
})

/** undefined だと value="" のプレースホルダーと一致せず先頭 option が見えることがある */
const selectBoundValue = computed(() => props.modelValue ?? '')

const rootClasses = computed(() => ({
  'base-select--error': props.hasError,
  'base-select--success': props.showSuccess && !props.hasError,
  'base-select--focus': focused.value,
}))

const controlClasses = computed(() => ({
  'base-select__control--error': props.hasError,
  'base-select__control--success': props.showSuccess && !props.hasError,
}))

// ==========================================================================
// Methods
// ==========================================================================

function onChange(e: Event) {
  const t = e.target as HTMLSelectElement
  emit('update:modelValue', t.value)
}

function onBlur(e: FocusEvent) {
  focused.value = false
  emit('blur', e)
}

function onFocus(e: FocusEvent) {
  focused.value = true
  emit('focus', e)
}
</script>

<style scoped lang="scss">
.base-select__control {
  width: 100%;
  min-height: var(--size-control-min-height);
  padding: var(--space-md) var(--space-control-inline-end) var(--space-md) var(--space-md);
  font-family: var(--font-family-base);
  font-size: var(--font-size-input);
  color: var(--color-text-primary);
  background-color: var(--color-input-bg);
  border: 1px solid transparent;
  border-radius: var(--radius-input);
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%234a5568' d='M1.41 0 6 4.58 10.59 0 12 1.41l-6 6-6-6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-md) center;
  transition: var(--transition-input);

  &:focus-visible {
    background-color: var(--color-input-bg-focus);
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 1px var(--color-border-focus);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.base-select__control--error {
  background-color: var(--color-input-bg-focus);
  border-color: var(--color-border-error);
}

.base-select__control--success:not(.base-select__control--error) {
  border-color: var(--color-success-border);
}
</style>
