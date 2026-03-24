<!--
  BaseTextarea - 複数行入力

  BaseInput と同様のフローティングラベルパターン。縦方向のみリサイズ可。
-->
<template>
  <div
    class="base-textarea"
    :class="rootClasses"
    :data-field-root="name"
  >
    <div
      class="base-textarea__shell"
      :class="shellClasses"
    >
      <span
        v-if="useFloatingLabel"
        class="base-textarea__float"
        aria-hidden="true"
      >{{ placeholder }}</span>
      <textarea
        :id="textareaId"
        ref="areaRef"
        class="base-textarea__control"
        :name="name"
        :value="modelValue"
        :placeholder="useFloatingLabel ? '' : placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :rows="rows"
        :aria-invalid="ariaInvalid"
        :aria-describedby="describedBy"
        :aria-required="required ? 'true' : undefined"
        v-bind="extraAttrs"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// ==========================================================================
// Imports
// ==========================================================================

import { computed, ref, useAttrs } from 'vue'

// ==========================================================================
// Props
// ==========================================================================

const props = withDefaults(
  defineProps<{
    modelValue: string
    name: string
    textareaId: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    rows?: number
    hasError?: boolean
    showSuccess?: boolean
    ariaInvalid?: boolean | 'true' | 'false'
    describedBy?: string
    floatingLabel?: boolean
  }>(),
  {
    rows: 4,
    hasError: false,
    showSuccess: false,
    ariaInvalid: false,
    floatingLabel: true,
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
const areaRef = ref<HTMLTextAreaElement | null>(null)

// ==========================================================================
// Computed
// ==========================================================================

const extraAttrs = computed(() => {
  const { class: _c, ...rest } = attrs as Record<string, unknown>
  return rest
})

const useFloatingLabel = computed(
  () =>
    props.floatingLabel &&
    !!props.placeholder &&
    props.placeholder.trim().length > 0,
)

const isFloated = computed(
  () => focused.value || (props.modelValue?.length ?? 0) > 0,
)

const rootClasses = computed(() => ({
  'base-textarea--error': props.hasError,
  'base-textarea--success': props.showSuccess && !props.hasError,
}))

const shellClasses = computed(() => ({
  'base-textarea__shell--float': useFloatingLabel.value,
  'base-textarea__shell--floated': isFloated.value,
  'base-textarea__shell--error': props.hasError,
  'base-textarea__shell--success': props.showSuccess && !props.hasError,
  'base-textarea__shell--disabled': props.disabled,
}))

// ==========================================================================
// Methods
// ==========================================================================

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}

function onBlur(e: FocusEvent) {
  focused.value = false
  emit('blur', e)
}

function onFocus(e: FocusEvent) {
  focused.value = true
  emit('focus', e)
}

defineExpose({ focus: () => areaRef.value?.focus() })
</script>

<style scoped lang="scss">
.base-textarea__shell {
  position: relative;
  display: block;
  border-radius: var(--radius-input);
  transition:
    border-color 0.2s ease-in-out,
    background-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &--float {
    min-height: var(--size-textarea-min-height);
    background-color: var(--color-input-bg);
    border: 1px solid transparent;
  }

  &:not(.base-textarea__shell--float) {
    background: transparent;
    border: none;
    box-shadow: none;
  }

  &--disabled {
    opacity: 0.55;
    pointer-events: none;
  }

  &--float:focus-within:not(.base-textarea__shell--error) {
    background-color: var(--color-input-bg-focus);
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 1px var(--color-border-focus);
  }

  &--float.base-textarea__shell--error {
    background-color: var(--color-input-bg-focus);
    border-color: var(--color-border-error);
    box-shadow: none;
  }

  &--float.base-textarea__shell--error:focus-within {
    border-color: var(--color-border-error);
    box-shadow: 0 0 0 1px var(--color-border-error);
  }

  &--float.base-textarea__shell--success:not(.base-textarea__shell--error):not(:focus-within) {
    border-color: var(--color-success-border);
  }
}

.base-textarea__float {
  position: absolute;
  left: var(--space-md);
  z-index: 1;
  max-width: calc(100% - 2 * var(--space-md));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
  color: var(--color-text-placeholder);
  font-size: var(--font-size-input);
  line-height: 1.25;
  transition:
    top 0.2s ease-in-out,
    transform 0.2s ease-in-out,
    color 0.2s ease-in-out;

  .base-textarea__shell--float:not(.base-textarea__shell--floated) & {
    top: var(--space-lg);
    transform: translateY(0);
  }

  .base-textarea__shell--float.base-textarea__shell--floated & {
    top: var(--space-sm);
    transform: translateY(0) scale(0.8125);
    transform-origin: left top;
    color: var(--color-text-muted);
  }
}

.base-textarea__control {
  display: block;
  width: 100%;
  min-height: var(--size-textarea-min-height);
  padding: var(--space-md) var(--space-md) var(--space-md);
  font-family: var(--font-family-base);
  font-size: var(--font-size-input);
  line-height: 1.5;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  border-radius: var(--radius-input);
  outline: none;
  resize: vertical;
  transition: padding 0.2s ease-in-out;

  .base-textarea__shell--float:not(.base-textarea__shell--floated) & {
    padding-top: var(--space-lg);
  }

  .base-textarea__shell--float.base-textarea__shell--floated & {
    padding-top: var(--space-xl);
  }

  &::placeholder {
    color: var(--color-text-placeholder);
  }

  &:focus-visible {
    outline: none;
  }
}

.base-textarea__shell:not(.base-textarea__shell--float) .base-textarea__control {
  min-height: var(--size-textarea-min-height);
  padding: var(--space-md) var(--space-md);
  background-color: var(--color-input-bg);
  border: 1px solid transparent;
  transition: var(--transition-input);

  &:focus-visible {
    background-color: var(--color-input-bg-focus);
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 1px var(--color-border-focus);
  }
}

.base-textarea__shell:not(.base-textarea__shell--float).base-textarea__shell--error
  .base-textarea__control {
  background-color: var(--color-input-bg-focus);
  border-color: var(--color-border-error);
}

.base-textarea__shell:not(.base-textarea__shell--float).base-textarea__shell--success:not(
    .base-textarea__shell--error
  ):not(:focus-within)
  .base-textarea__control {
  border-color: var(--color-success-border);
}
</style>
