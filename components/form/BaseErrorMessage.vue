<!--
  BaseErrorMessage - フィールドエラー表示

  role="alert" / aria-live でスクリーンリーダーに伝える。v-show で表示切替。
-->
<template>
  <p
    v-show="visible"
    :id="messageId"
    class="base-error-message"
    role="alert"
    aria-live="polite"
  >
    {{ message }}
  </p>
</template>

<script setup lang="ts">
// ==========================================================================
// Props
// ==========================================================================

withDefaults(
  defineProps<{
    messageId: string
    message?: string
    visible?: boolean
  }>(),
  {
    message: '',
    visible: false,
  },
)
</script>

<style scoped lang="scss">
.base-error-message {
  margin: var(--space-sm) 0 0;
  font-size: var(--font-size-error);
  line-height: 1.4;
  color: var(--color-error-text);
  animation: base-error-in 0.2s ease-out;
}

@keyframes base-error-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
