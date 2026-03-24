<!--
  RegistrationConfirmPanel - 入力内容の確認とダミー登録

  フォーム値は useFormValues で参照。登録ボタンは API によらず完了へ遷移するデモ用。
-->
<template>
  <div class="registration-confirm">
    <h2
      id="reg-confirm-heading"
      class="registration-confirm__title"
      tabindex="-1"
    >
      入力内容の確認
    </h2>
    <p class="registration-confirm__lead">
      以下の内容で登録します。修正する場合は「修正する」を押してください。
    </p>

    <!-- 項目一覧 -->
    <dl class="registration-confirm__list">
      <div
        v-for="row in rows"
        :key="row.key"
        class="registration-confirm__row"
      >
        <dt class="registration-confirm__dt">{{ row.label }}</dt>
        <dd class="registration-confirm__dd">{{ row.value }}</dd>
      </div>
    </dl>

    <p
      class="registration-confirm__dummy-note"
      role="note"
    >
      ※登録処理はダミーです（外部への送信は行いません）。
    </p>

    <!-- 登録（ダミー）・修正リンク -->
    <div class="registration-page__actions registration-confirm__actions">
      <button
        type="button"
        class="member-form__submit"
        :disabled="busy"
        :aria-busy="busy ? 'true' : undefined"
        @click="onRegister"
      >
        <span v-if="busy">処理中…</span>
        <span v-else>登録する</span>
      </button>
      <button
        type="button"
        class="registration-confirm__edit-link"
        :disabled="busy"
        @click="onBack"
      >
        修正する
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// ==========================================================================
// Imports
// ==========================================================================

import { computed, ref } from 'vue'
import { useFormContext, useFormValues } from 'vee-validate'
import { defaultRegistrationValues } from '~/constants/defaultRegistrationValues'
import { newsletterChoiceLabel } from '~/constants/newsletter'
import { REGISTRATION_STORAGE_KEY } from '~/composables/useForm'
import type { RegistrationFormValues } from '~/schemas/registrationSchema'

// ==========================================================================
// Emits
// ==========================================================================

const emit = defineEmits<{
  back: []
  complete: []
}>()

// ==========================================================================
// Composables & state
// ==========================================================================

const { resetForm } = useFormContext<RegistrationFormValues>()
const values = useFormValues<RegistrationFormValues>()
const busy = ref(false)

// ==========================================================================
// Computed
// ==========================================================================

const rows = computed(() => {
  const v = values.value
  return [
    { key: 'name', label: '氏名', value: confirmDisplay(v.name) },
    { key: 'nameKana', label: '氏名（かな）', value: confirmDisplay(v.nameKana) },
    { key: 'email', label: 'メールアドレス', value: confirmDisplay(v.email) },
    { key: 'phone', label: '電話番号（ハイフン無し）', value: confirmDisplay(v.phone) },
    { key: 'zipCode', label: '郵便番号（ハイフン無し）', value: confirmDisplay(v.zipCode) },
    { key: 'prefecture', label: '都道府県', value: confirmDisplay(v.prefecture) },
    { key: 'city', label: '市区郡町村', value: confirmDisplay(v.city) },
    { key: 'town', label: '町名', value: confirmDisplay(v.town) },
    { key: 'street', label: '番地', value: confirmDisplay(v.street) },
    { key: 'addressOther', label: '建物・部屋番号', value: confirmDisplay(v.addressOther) },
    {
      key: 'newsletter',
      label: 'メルマガ配信',
      value: confirmDisplay(newsletterChoiceLabel(v.newsletter)),
    },
    { key: 'purpose', label: '利用目的', value: confirmDisplay(v.purpose) },
    { key: 'password', label: 'パスワード', value: maskPassword(String(v.password ?? '')) },
    {
      key: 'passwordConfirm',
      label: 'パスワード（確認）',
      value: maskPassword(String(v.passwordConfirm ?? '')),
    },
    {
      key: 'agreeTerms',
      label: '利用規約・プライバシーポリシーへの同意',
      value: v.agreeTerms ? '同意する' : '—',
    },
  ]
})

// ==========================================================================
// Methods
// ==========================================================================

/**
 * 空・未設定は全角ダッシュで示す（確認画面用）
 */
function confirmDisplay(v: unknown): string {
  if (v === undefined || v === null || v === '') return '—'
  return String(v)
}

/**
 * パスワードは長さだけ示し中身は伏せる
 */
function maskPassword(p: string): string {
  if (!p) return '—'
  return '●'.repeat(Math.min(p.length, 24))
}

function onBack() {
  emit('back')
}

async function onRegister() {
  busy.value = true
  try {
    await new Promise((r) => setTimeout(r, 800))
    if (import.meta.client) {
      localStorage.removeItem(REGISTRATION_STORAGE_KEY)
    }
    resetForm({
      values: { ...defaultRegistrationValues },
    })
    emit('complete')
  } finally {
    busy.value = false
  }
}
</script>

<style scoped lang="scss">
.registration-confirm__title {
  margin: 0 0 var(--space-sm);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent);
}

.registration-confirm__lead {
  margin: 0 0 var(--space-lg);
  font-size: var(--font-size-hint);
  line-height: 1.5;
  color: var(--color-text-muted);
}

.registration-confirm__list {
  margin: 0 0 var(--space-lg);
  padding: 0;
}

.registration-confirm__row {
  display: grid;
  grid-template-columns: minmax(7rem, 38%) 1fr;
  gap: var(--space-sm) var(--space-md);
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-border-subtle);
}

.registration-confirm__row:first-of-type {
  border-top: 1px solid var(--color-border-subtle);
}

.registration-confirm__dt {
  margin: 0;
  font-size: var(--font-size-hint);
  font-weight: 600;
  color: var(--color-text-label);
}

.registration-confirm__dd {
  margin: 0;
  font-size: var(--font-size-hint);
  line-height: 1.45;
  color: var(--color-text-primary);
  word-break: break-word;
}

.registration-confirm__dummy-note {
  margin: 0 0 var(--space-lg);
  font-size: var(--font-size-hint);
  color: var(--color-text-muted);
}

.registration-confirm__actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-md);
}

.registration-confirm__edit-link {
  align-self: center;
  margin: 0;
  padding: 0;
  font-family: var(--font-family-base);
  font-size: var(--font-size-hint);
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 0.2em;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s ease, opacity 0.2s ease;

  &:hover:not(:disabled) {
    color: var(--color-text-primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 4px;
    border-radius: 2px;
  }
}
</style>
