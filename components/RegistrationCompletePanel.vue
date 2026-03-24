<!--
  RegistrationCompletePanel - 登録完了の静的表示

  ダミー完了メッセージと注記のみ。フォームは MemberRegistrationForm 側で既にリセット済み。
-->
<template>
  <div
    class="registration-complete"
    role="status"
    aria-live="polite"
  >
    <h2
      id="reg-complete-heading"
      class="registration-complete__title"
      tabindex="-1"
    >
      登録完了
    </h2>
    <p class="registration-page__toast registration-complete__toast">
      お手続きが完了しました。ご入力ありがとうございました。
    </p>
    <p class="registration-complete__dummy">
      ※登録処理はダミーです。実際のデータ送信は行っていません。
    </p>
  </div>
</template>

<style scoped lang="scss">
.registration-complete__title {
  margin: 0 0 var(--space-md);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent);
}

.registration-complete__toast {
  margin-bottom: var(--space-md);
}

.registration-complete__dummy {
  margin: 0;
  font-size: var(--font-size-hint);
  color: var(--color-text-muted);
}
</style>
