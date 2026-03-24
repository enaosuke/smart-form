<!--
  BaseLabel - フォーム用ラベル

  for と必須バッジ。input の id と htmlFor を揃えて使う。
-->
<template>
  <label
    class="base-label"
    :for="htmlFor"
  >
    <span class="base-label__text">{{ label }}</span>
    <span
      v-if="required"
      class="base-label__required"
      aria-hidden="true"
    >必須</span>
  </label>
</template>

<script setup lang="ts">
// ==========================================================================
// Props
// ==========================================================================

withDefaults(
  defineProps<{
    /** label の for と input の id を一致させる */
    htmlFor: string
    label: string
    required?: boolean
  }>(),
  {
    required: false,
  },
)
</script>

<style scoped lang="scss">
.base-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  font-size: var(--font-size-label);
  font-weight: 600;
  color: var(--color-text-label);
  cursor: pointer;
}

.base-label__required {
  display: inline-block;
  padding: 2px var(--space-xs);
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-error-text);
  background: var(--color-error-bg-tint);
  border-radius: var(--space-sm);
}
</style>
