<!--
  BaseRadioGroup - fieldset ベースのラジオ群

  legend・任意 hint・オプション一覧。キーボードフォーカスは各 input に残す。
-->
<template>
  <fieldset
    class="base-radio-group"
    :class="{ 'base-radio-group--error': hasError }"
    :data-field-root="name"
  >
    <legend
      :id="legendId"
      class="base-radio-group__legend"
    >
      <span class="base-radio-group__legend-text">{{ legend }}</span>
      <span
        v-if="required"
        class="base-radio-group__required"
        aria-hidden="true"
      >必須</span>
    </legend>
    <p
      v-if="hint"
      :id="hintId"
      class="base-radio-group__hint"
    >
      {{ hint }}
    </p>
    <div
      class="base-radio-group__options"
      :aria-describedby="hint ? hintId : undefined"
    >
      <div
        v-for="opt in options"
        :key="opt.value"
        class="base-radio-group__item"
      >
        <input
          :id="`${groupId}-${opt.value}`"
          class="base-radio-group__input"
          type="radio"
          :name="name"
          :value="opt.value"
          :checked="modelValue === opt.value"
          :disabled="disabled"
          :required="required"
          :aria-invalid="ariaInvalid"
          :aria-describedby="describedBy"
          v-bind="extraAttrs"
          @change="select(opt.value)"
          @blur="emit('blur', $event)"
          @focus="emit('focus', $event)"
        >
        <label
          class="base-radio-group__label"
          :for="`${groupId}-${opt.value}`"
        >
          <span
            class="base-radio-group__visual"
            aria-hidden="true"
          />
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
// ==========================================================================
// Imports
// ==========================================================================

import { computed, useAttrs } from 'vue'

export interface RadioOption {
  value: string
  label: string
}

// ==========================================================================
// Props
// ==========================================================================

const props = withDefaults(
  defineProps<{
    modelValue: string
    name: string
    groupId: string
    legend: string
    options: RadioOption[]
    hint?: string
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
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

// ==========================================================================
// State
// ==========================================================================

const attrs = useAttrs()

// ==========================================================================
// Computed
// ==========================================================================

const extraAttrs = computed(() => {
  const { class: _c, ...rest } = attrs as Record<string, unknown>
  return rest
})

const legendId = computed(() => `${props.groupId}-legend`)
const hintId = computed(() => `${props.groupId}-hint`)

// ==========================================================================
// Methods
// ==========================================================================

function select(value: string) {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.base-radio-group {
  margin: 0;
  padding: 0;
  border: none;
}

.base-radio-group__legend {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0;
  margin-bottom: var(--space-sm);
  font-size: var(--font-size-label);
  font-weight: 600;
  color: var(--color-text-label);
}

.base-radio-group__required {
  display: inline-block;
  padding: 2px var(--space-xs);
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-error-text);
  background: var(--color-error-bg-tint);
  border-radius: var(--space-sm);
}

.base-radio-group__hint {
  margin: 0 0 var(--space-md);
  font-size: var(--font-size-hint);
  color: var(--color-text-muted);
}

.base-radio-group__options {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.base-radio-group__item {
  display: flex;
  align-items: center;
}

.base-radio-group__input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.base-radio-group__label {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  cursor: pointer;
  font-size: var(--font-size-input);
  color: var(--color-text-primary);
}

.base-radio-group__visual {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: 2px solid var(--color-text-primary);
  border-radius: 50%;
  background: var(--color-input-bg);
  position: relative;
  transition: border-color 0.15s ease;

  &::after {
    content: '';
    position: absolute;
    inset: var(--space-xs);
    border-radius: 50%;
    background: var(--color-text-primary);
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 0.15s ease, transform 0.15s ease;
  }
}

.base-radio-group__input:focus-visible + .base-radio-group__label .base-radio-group__visual {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 4px;
}

.base-radio-group__input:checked + .base-radio-group__label .base-radio-group__visual {
  border-color: var(--color-text-primary);

  &::after {
    opacity: 1;
    transform: scale(1);
  }
}

.base-radio-group--error .base-radio-group__visual {
  border-color: var(--color-border-error);
}
</style>
