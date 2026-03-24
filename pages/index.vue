<!--
  pages/index - 会員登録トップページ

  レイアウトとリード文を持ち、フォーム段階に応じてヘッダーの表示を切り替える。
-->
<template>
  <main class="registration-page">
    <!-- 入力ステップのみ表示（確認・完了では画面を簡素化） -->
    <header
      v-if="formStep === 'edit'"
      class="registration-page__header"
    >
      <h1 class="registration-page__title">
        会員登録
      </h1>
      <p class="registration-page__lead">
        Nuxt 3（Vue 3）と vee-validate / Yup による会員登録フォームの実装例です。
        <br>
        コントラスト比、ラベルとフォーカス、キーボード操作、バリデーションエラーの提示など、WCAG を参照したアクセシビリティ配慮を取り入れています。
      </p>
    </header>
    <MemberRegistrationForm @update:step="formStep = $event" />
  </main>
</template>

<script setup lang="ts">
// ==========================================================================
// Imports
// ==========================================================================

import type { RegistrationFlowStep } from '~/types/registrationFlow'

// ==========================================================================
// State
// ==========================================================================

const formStep = ref<RegistrationFlowStep>('edit')

// ==========================================================================
// Head
// ==========================================================================

useHead({
  title: '会員登録',
})
</script>
