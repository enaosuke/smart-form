<!--
  BaseInput - 単一行テキスト入力

  フローティングラベル・クリア・パスワード表示切替をオプションで持つ。vee-validate と v-model で連携。
-->
<template>
  <div
    class="base-input"
    :class="rootClasses"
    :data-field-root="name"
  >
    <div
      class="base-input__shell"
      :class="shellClasses"
    >
      <span
        v-if="useFloatingLabel"
        class="base-input__float"
        aria-hidden="true"
      >{{ placeholder }}</span>
      <div class="base-input__control-wrap">
        <input
          :id="inputId"
          ref="inputRef"
          class="base-input__control"
          :class="controlClasses"
          :type="effectiveInputType"
          :name="name"
          :value="modelValue"
          :placeholder="useFloatingLabel ? '' : placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :autocomplete="autocomplete"
          :inputmode="inputmode"
          :aria-invalid="ariaInvalid"
          :aria-describedby="describedBy"
          :aria-required="required ? 'true' : undefined"
          v-bind="extraAttrs"
          @input="onInput"
          @blur="onBlur"
          @focus="onFocus"
        >
        <button
          v-if="showPasswordToggle && type === 'password' && !disabled"
          type="button"
          class="base-input__password-toggle"
          tabindex="-1"
          :aria-label="passwordVisible ? passwordHideLabel : passwordShowLabel"
          :aria-pressed="passwordVisible ? 'true' : 'false'"
          @click="togglePasswordVisible"
        >
          <i
            class="fa-solid"
            :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'"
            aria-hidden="true"
          />
        </button>
        <button
          v-if="showClear && modelValue && !disabled"
          type="button"
          class="base-input__clear"
          tabindex="-1"
          :aria-label="clearLabel"
          @click="clear"
        >
          <span
            class="base-input__clear-icon"
            aria-hidden="true"
          >×</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ==========================================================================
// Imports
// ==========================================================================

import { computed, ref, useAttrs, watch } from 'vue'

// ==========================================================================
// Props
// ==========================================================================

const props = withDefaults(
  defineProps<{
    modelValue: string
    /** vee-validate Field の name と揃える（スクロール用 data 属性） */
    name: string
    inputId: string
    type?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    autocomplete?: string
    inputmode?: 'text' | 'numeric' | 'tel' | 'email' | 'decimal' | 'search' | 'url' | 'none'
    /** エラー表示中 */
    hasError?: boolean
    /** バリデーション通過かつ表示方針を満たす */
    showSuccess?: boolean
    /** aria-invalid */
    ariaInvalid?: boolean | 'true' | 'false'
    /** エラー・ヒントの id を空白区切り */
    describedBy?: string
    showClear?: boolean
    clearLabel?: string
    /** type=password 時: 右端に表示切替（Font Awesome の目アイコン） */
    showPasswordToggle?: boolean
    passwordShowLabel?: string
    passwordHideLabel?: string
    /** false で従来の単一プレースホルダー */
    floatingLabel?: boolean
  }>(),
  {
    type: 'text',
    hasError: false,
    showSuccess: false,
    ariaInvalid: false,
    showClear: false,
    clearLabel: '入力をクリア',
    showPasswordToggle: false,
    passwordShowLabel: 'パスワードを表示',
    passwordHideLabel: 'パスワードを隠す',
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
const inputRef = ref<HTMLInputElement | null>(null)
const passwordVisible = ref(false)

// ==========================================================================
// Watch
// ==========================================================================

watch(
  () => props.type,
  () => {
    passwordVisible.value = false
  },
)

// ==========================================================================
// Computed
// ==========================================================================

const extraAttrs = computed(() => {
  const { class: _c, ...rest } = attrs as Record<string, unknown>
  return rest
})

const effectiveInputType = computed(() => {
  if (!props.showPasswordToggle || props.type !== 'password') return props.type
  return passwordVisible.value ? 'text' : 'password'
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
  'base-input--error': props.hasError,
  'base-input--success': props.showSuccess && !props.hasError,
}))

const shellClasses = computed(() => ({
  'base-input__shell--float': useFloatingLabel.value,
  'base-input__shell--floated': isFloated.value,
  'base-input__shell--error': props.hasError,
  'base-input__shell--success': props.showSuccess && !props.hasError,
  'base-input__shell--disabled': props.disabled,
}))

const controlClasses = computed(() => ({
  'base-input__control--with-clear': props.showClear,
  'base-input__control--with-password-toggle':
    props.showPasswordToggle && props.type === 'password',
}))

// ==========================================================================
// Methods
// ==========================================================================

function onInput(e: Event) {
  const t = e.target as HTMLInputElement
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

function clear() {
  emit('update:modelValue', '')
  inputRef.value?.focus()
}

function togglePasswordVisible() {
  passwordVisible.value = !passwordVisible.value
  inputRef.value?.focus()
}

defineExpose({
  focus: () => inputRef.value?.focus(),
})
</script>

<style scoped lang="scss">
.base-input__shell {
  position: relative;
  display: block;
  border-radius: var(--radius-input);
  transition:
    border-color 0.2s ease-in-out,
    background-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &--float {
    min-height: var(--size-control-min-height);
    background-color: var(--color-input-bg);
    border: 1px solid transparent;
  }

  &:not(.base-input__shell--float) {
    min-height: 0;
    background: transparent;
    border: none;
    box-shadow: none;
  }

  &--disabled {
    opacity: 0.55;
    pointer-events: none;
  }

  /* フロート時: フォーカスで黒枠（エラー時は赤） */
  &--float:focus-within:not(.base-input__shell--error) {
    background-color: var(--color-input-bg-focus);
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 1px var(--color-border-focus);
  }

  &--float.base-input__shell--error {
    background-color: var(--color-input-bg-focus);
    border-color: var(--color-border-error);
    box-shadow: none;
  }

  &--float.base-input__shell--error:focus-within {
    border-color: var(--color-border-error);
    box-shadow: 0 0 0 1px var(--color-border-error);
  }

  &--float.base-input__shell--success:not(.base-input__shell--error):not(:focus-within) {
    border-color: var(--color-success-border);
  }
}

.base-input__float {
  position: absolute;
  left: var(--space-md);
  z-index: 1;
  max-width: calc(100% - var(--space-control-inline-end));
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
    font-size 0.2s ease-in-out,
    color 0.2s ease-in-out;

  .base-input__shell--float:not(.base-input__shell--floated) & {
    top: 50%;
    transform: translateY(-50%);
  }

  .base-input__shell--float.base-input__shell--floated & {
    top: var(--space-sm);
    transform: translateY(0) scale(0.8125);
    transform-origin: left top;
    color: var(--color-text-muted);
  }
}

.base-input__control-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input__control {
  width: 100%;
  min-height: var(--size-control-min-height);
  padding: var(--space-md) var(--space-md);
  font-family: var(--font-family-base);
  font-size: var(--font-size-input);
  line-height: 1.4;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  border-radius: var(--radius-input);
  outline: none;

  .base-input__shell--float:not(.base-input__shell--floated) & {
    padding-top: var(--space-md);
    padding-bottom: var(--space-md);
  }

  .base-input__shell--float.base-input__shell--floated & {
    padding-top: var(--space-lg);
    padding-bottom: var(--space-sm);
  }

  &.base-input__control--with-clear {
    padding-right: var(--space-control-inline-end);
  }

  &.base-input__control--with-password-toggle {
    padding-right: var(--space-control-inline-end);
  }

  &.base-input__control--with-clear.base-input__control--with-password-toggle {
    padding-right: var(--space-control-inline-end-dual);
  }

  &::placeholder {
    color: var(--color-text-placeholder);
    font-weight: 400;
  }

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
  }
}

/* フローティング無効時は従来の単一ブロック */
.base-input__shell:not(.base-input__shell--float) {
  padding: 0;

  .base-input__control {
    min-height: var(--size-control-min-height);
    padding: var(--space-md) var(--space-md);
    background-color: var(--color-input-bg);
    border: 1px solid transparent;
    border-radius: var(--radius-input);
    transition: var(--transition-input);

    &:focus-visible {
      background-color: var(--color-input-bg-focus);
      border-color: var(--color-border-focus);
      box-shadow: var(--shadow-focus);
    }
  }

  &:focus-within:not(.base-input__shell--error) .base-input__control {
    background-color: var(--color-input-bg-focus);
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 1px var(--color-border-focus);
  }

  &.base-input__shell--error .base-input__control {
    background-color: var(--color-input-bg-focus);
    border-color: var(--color-border-error);
  }

  &.base-input__shell--success:not(.base-input__shell--error):not(:focus-within) .base-input__control {
    border-color: var(--color-success-border);
  }
}

.base-input__password-toggle {
  position: absolute;
  right: var(--space-sm);
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size-icon-hit);
  height: var(--size-icon-hit);
  padding: 0;
  margin: 0;
  border: none;
  border-radius: var(--space-sm);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: var(--color-text-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
}

.base-input__shell .base-input__control-wrap:has(.base-input__clear):has(.base-input__password-toggle)
  .base-input__password-toggle {
  right: var(--space-control-inline-end);
}

.base-input__clear {
  position: absolute;
  right: var(--space-sm);
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size-icon-hit);
  height: var(--size-icon-hit);
  padding: 0;
  margin: 0;
  border: none;
  border-radius: var(--space-sm);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: var(--color-text-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
}

.base-input__clear-icon {
  font-size: 1.25rem;
  line-height: 1;
}
</style>
