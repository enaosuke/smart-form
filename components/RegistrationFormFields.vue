<!--
  RegistrationFormFields - 会員登録フォームのフィールド一式

  FormFieldShell / Field で vee-validate と接続。郵便番号→住所、メール候補、「確認する」まで含む。
-->
<template>
  <div class="registration-form-fields">
    <!-- 氏名 -->
    <div class="form-field">
      <FormFieldShell name="name">
        <template #default="{ field, errorMessage, meta, showError, showSuccess }">
          <BaseLabel
            html-for="reg-name"
            label="氏名"
            required
          />
          <BaseInput
            input-id="reg-name"
            name="name"
            :model-value="field.value"
            autocomplete="name"
            placeholder="例: 山田 太郎"
            required
            :has-error="showError"
            :show-success="showSuccess"
            :aria-invalid="showError"
            :described-by="errorOnlyDescribedBy('reg-name', !!showError)"
            show-clear
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <BaseErrorMessage
            message-id="reg-name-error"
            :message="errorMessage"
            :visible="showError"
          />
        </template>
      </FormFieldShell>
    </div>

    <div class="form-field">
      <FormFieldShell name="nameKana">
        <template #default="{ field, errorMessage, meta, showError, showSuccess }">
          <BaseLabel
            html-for="reg-name-kana"
            label="氏名（かな）"
            required
          />
          <BaseInput
            input-id="reg-name-kana"
            name="nameKana"
            :model-value="field.value"
            autocomplete="off"
            lang="ja"
            inputmode="text"
            placeholder="例: やまだ たろう"
            required
            :has-error="showError"
            :show-success="showSuccess"
            :aria-invalid="showError"
            :described-by="errorOnlyDescribedBy('reg-name-kana', !!showError)"
            show-clear
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <BaseErrorMessage
            message-id="reg-name-kana-error"
            :message="errorMessage"
            :visible="showError"
          />
        </template>
      </FormFieldShell>
    </div>

    <!-- メール -->
    <div class="form-field">
      <FormFieldShell name="email">
        <template #default="{ field, errorMessage, meta, showError, showSuccess }">
          <BaseLabel
            html-for="reg-email"
            label="メールアドレス"
            required
          />
          <BaseInput
            input-id="reg-email"
            name="email"
            type="email"
            :model-value="field.value"
            autocomplete="email"
            placeholder="例: name@example.com"
            required
            :has-error="showError"
            :show-success="showSuccess"
            :aria-invalid="showError"
            :described-by="errorOnlyDescribedBy('reg-email', !!showError)"
            show-clear
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <ul
            v-if="emailSuggestions.length"
            class="email-suggest"
            aria-label="メールドメインの候補"
          >
            <li
              v-for="s in emailSuggestions"
              :key="s"
            >
              <button
                type="button"
                class="email-suggest__btn"
                @click="applyEmailSuggestion(field, s)"
              >
                {{ s }}
              </button>
            </li>
          </ul>
          <BaseErrorMessage
            message-id="reg-email-error"
            :message="errorMessage"
            :visible="showError"
          />
        </template>
      </FormFieldShell>
    </div>

    <!-- 電話 -->
    <div class="form-field">
      <FormFieldShell name="phone">
        <template #default="{ field, errorMessage, showError, showSuccess }">
          <BaseLabel
            html-for="reg-phone"
            label="電話番号（ハイフン無し）"
          />
          <span
            id="reg-phone-sr"
            class="sr-only"
          >ハイフンなしの10桁または11桁で入力してください。</span>
          <BaseInput
            input-id="reg-phone"
            name="phone"
            type="tel"
            inputmode="numeric"
            :model-value="field.value"
            autocomplete="tel"
            placeholder="例: 09012345678"
            :has-error="showError"
            :show-success="showSuccess"
            :aria-invalid="showError"
            :described-by="phoneDescribedBy(!!showError)"
            @update:model-value="(v) => field.onChange(formatJapanesePhone(v))"
            @blur="field.onBlur"
          />
          <BaseErrorMessage
            message-id="reg-phone-error"
            :message="errorMessage"
            :visible="showError"
          />
        </template>
      </FormFieldShell>
    </div>

    <!-- 郵便番号 -->
    <div class="form-field">
      <FormFieldShell name="zipCode">
        <template #default="{ field, errorMessage, showError, showSuccess }">
          <BaseLabel
            html-for="reg-zip"
            label="郵便番号（ハイフン無し）"
          />
          <span
            id="reg-zip-sr"
            class="sr-only"
          >7桁の郵便番号（ハイフンなし）を入力したうえで、右の「郵便番号住所変換」ボタンを押すと、都道府県・市区郡町村・町名が入力されます。</span>
          <div class="form-field__zip-row">
            <div class="form-field__zip-row-input">
              <BaseInput
                input-id="reg-zip"
                name="zipCode"
                type="tel"
                inputmode="numeric"
                :model-value="field.value"
                autocomplete="postal-code"
                placeholder="例: 1000001"
                :has-error="showError"
                :show-success="showSuccess"
                :aria-invalid="showError"
                :described-by="zipDescribedBy(!!showError)"
                @update:model-value="(v) => field.onChange(formatZipCode(v))"
                @blur="field.onBlur"
              />
            </div>
            <button
              type="button"
              class="member-form__submit--zip-inline"
              aria-label="郵便番号住所変換"
              :disabled="zipDigits(field.value ?? '').length !== 7 || zipLookupBusy"
              :aria-busy="zipLookupBusy ? 'true' : undefined"
              @click="onZipConvertClick(field)"
            >
              <template v-if="zipLookupBusy">変換中…</template>
              <template v-else>郵便番号<br />住所変換</template>
            </button>
          </div>
          <BaseErrorMessage
            message-id="reg-zip-error"
            :message="errorMessage"
            :visible="showError"
          />
        </template>
      </FormFieldShell>
    </div>

    <!-- 住所 -->
    <div class="form-field">
      <FormFieldShell name="prefecture">
        <template #default="{ field, errorMessage, showError, showSuccess }">
          <BaseLabel
            html-for="reg-pref"
            label="都道府県"
          />
          <BaseSelect
            select-id="reg-pref"
            name="prefecture"
            :model-value="field.value"
            :options="prefectureOptions"
            placeholder="選択してください"
            :has-error="showError"
            :show-success="showSuccess"
            :aria-invalid="showError"
            :described-by="errorOnlyDescribedBy('reg-pref', !!showError)"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <BaseErrorMessage
            message-id="reg-pref-error"
            :message="errorMessage"
            :visible="showError"
          />
        </template>
      </FormFieldShell>
    </div>

    <div class="form-field">
      <FormFieldShell name="city">
        <template #default="{ field, errorMessage, showError, showSuccess }">
          <BaseLabel
            html-for="reg-city"
            label="市区郡町村"
          />
          <BaseInput
            input-id="reg-city"
            name="city"
            :model-value="field.value"
            autocomplete="address-level2"
            placeholder="例: 千代田区"
            :has-error="showError"
            :show-success="showSuccess"
            :aria-invalid="showError"
            :described-by="errorOnlyDescribedBy('reg-city', !!showError)"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <BaseErrorMessage
            message-id="reg-city-error"
            :message="errorMessage"
            :visible="showError"
          />
        </template>
      </FormFieldShell>
    </div>

    <div class="form-field">
      <FormFieldShell name="town">
        <template #default="{ field, errorMessage, showError, showSuccess }">
          <BaseLabel
            html-for="reg-town"
            label="町名"
          />
          <BaseInput
            input-id="reg-town"
            name="town"
            :model-value="field.value"
            autocomplete="address-line3"
            placeholder="例: 千代田"
            :has-error="showError"
            :show-success="showSuccess"
            :aria-invalid="showError"
            :described-by="errorOnlyDescribedBy('reg-town', !!showError)"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <BaseErrorMessage
            message-id="reg-town-error"
            :message="errorMessage"
            :visible="showError"
          />
        </template>
      </FormFieldShell>
    </div>

    <div class="form-field">
      <FormFieldShell name="street">
        <template #default="{ field, errorMessage, showError, showSuccess }">
          <BaseLabel
            html-for="reg-street"
            label="番地"
          />
          <BaseInput
            input-id="reg-street"
            name="street"
            :model-value="field.value"
            autocomplete="street-address"
            placeholder="例: 1-1-1"
            :has-error="showError"
            :show-success="showSuccess"
            :aria-invalid="showError"
            :described-by="errorOnlyDescribedBy('reg-street', !!showError)"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <BaseErrorMessage
            message-id="reg-street-error"
            :message="errorMessage"
            :visible="showError"
          />
        </template>
      </FormFieldShell>
    </div>

    <div class="form-field">
      <FormFieldShell name="addressOther">
        <template #default="{ field, errorMessage, showError, showSuccess }">
          <BaseLabel
            html-for="reg-other"
            label="建物・部屋番号"
          />
          <BaseInput
            input-id="reg-other"
            name="addressOther"
            :model-value="field.value"
            autocomplete="address-line2"
            placeholder="例: ○○マンション 101号室"
            :has-error="showError"
            :show-success="showSuccess"
            :aria-invalid="showError"
            :described-by="errorOnlyDescribedBy('reg-other', !!showError)"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <BaseErrorMessage
            message-id="reg-other-error"
            :message="errorMessage"
            :visible="showError"
          />
        </template>
      </FormFieldShell>
    </div>

    <!-- メルマガ -->
    <div class="form-field">
      <Field
        v-slot="{ field, errorMessage, meta }"
        name="newsletter"
      >
        <div
          :data-invalid="showErrorAfterSubmitOrTouch(meta, errorMessage) ? 'true' : undefined"
        >
          <BaseRadioGroup
            :model-value="field.value ?? ''"
            name="newsletter"
            group-id="reg-newsletter"
            legend="メルマガ配信"
            :options="newsletterOptions"
            required
            :has-error="showErrorAfterSubmitOrTouch(meta, errorMessage)"
            :aria-invalid="showErrorAfterSubmitOrTouch(meta, errorMessage)"
            :described-by="
              showErrorAfterSubmitOrTouch(meta, errorMessage) ? 'reg-newsletter-error' : undefined
            "
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <BaseErrorMessage
            message-id="reg-newsletter-error"
            :message="errorMessage"
            :visible="showErrorAfterSubmitOrTouch(meta, errorMessage)"
          />
        </div>
      </Field>
    </div>

    <!-- 利用目的 -->
    <div class="form-field">
      <FormFieldShell name="purpose">
        <template #default="{ field, errorMessage, showError, showSuccess }">
          <BaseLabel
            html-for="reg-purpose"
            label="利用目的"
          />
          <BaseTextarea
            textarea-id="reg-purpose"
            name="purpose"
            :model-value="field.value"
            placeholder="例: 業務での請求書整理など"
            :has-error="showError"
            :show-success="showSuccess"
            :aria-invalid="showError"
            :described-by="errorOnlyDescribedBy('reg-purpose', !!showError)"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <BaseErrorMessage
            message-id="reg-purpose-error"
            :message="errorMessage"
            :visible="showError"
          />
        </template>
      </FormFieldShell>
    </div>

    <!-- パスワード -->
    <div class="form-field">
      <FormFieldShell name="password">
        <template #default="{ field, errorMessage, showError, showSuccess }">
          <BaseLabel
            html-for="reg-password"
            label="パスワード"
            required
          />
          <p
            id="reg-password-hint"
            class="form-field__hint"
          >
            8文字以上。英大文字・小文字・数字・記号を組み合わせると安全です
          </p>
          <BaseInput
            input-id="reg-password"
            name="password"
            type="password"
            :model-value="field.value"
            autocomplete="new-password"
            show-password-toggle
            required
            :has-error="showError"
            :show-success="showSuccess"
            :aria-invalid="showError"
            :described-by="passwordDescribedBy(!!showError)"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <PasswordStrengthMeter
            label-id="reg-password-strength"
            :password="field.value"
          />
          <BaseErrorMessage
            message-id="reg-password-error"
            :message="errorMessage"
            :visible="showError"
          />
        </template>
      </FormFieldShell>
    </div>

    <div class="form-field">
      <FormFieldShell name="passwordConfirm">
        <template #default="{ field, errorMessage, showError, showSuccess }">
          <BaseLabel
            html-for="reg-password2"
            label="パスワード（確認）"
            required
          />
          <BaseInput
            input-id="reg-password2"
            name="passwordConfirm"
            type="password"
            :model-value="field.value"
            autocomplete="new-password"
            show-password-toggle
            required
            :has-error="showError"
            :show-success="showSuccess"
            :aria-invalid="showError"
            :described-by="errorOnlyDescribedBy('reg-password2', !!showError)"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <BaseErrorMessage
            message-id="reg-password2-error"
            :message="errorMessage"
            :visible="showError"
          />
        </template>
      </FormFieldShell>
    </div>

    <!-- 同意 -->
    <div class="form-field">
      <Field
        v-slot="{ field, errorMessage, meta }"
        name="agreeTerms"
        type="checkbox"
        :value="true"
        :unchecked-value="false"
      >
        <div
          :data-invalid="showErrorAfterSubmitOrTouch(meta, errorMessage) ? 'true' : undefined"
        >
          <BaseCheckbox
            input-id="reg-agree"
            name="agreeTerms"
            :model-value="!!field.checked"
            required
            :has-error="showErrorAfterSubmitOrTouch(meta, errorMessage)"
            :aria-invalid="showErrorAfterSubmitOrTouch(meta, errorMessage)"
            :described-by="
              showErrorAfterSubmitOrTouch(meta, errorMessage)
                ? 'reg-agree-hint reg-agree-error'
                : 'reg-agree-hint'
            "
            @update:model-value="(v) => field.onChange(v)"
            @blur="field.onBlur"
          >
            <span id="reg-agree-hint">
              <a
                href="#terms"
                class="member-form__link"
                @click.prevent
              >利用規約</a>
              および
              <a
                href="#privacy"
                class="member-form__link"
                @click.prevent
              >プライバシーポリシー</a>
              の内容を確認し、同意します
            </span>
          </BaseCheckbox>
          <BaseErrorMessage
            message-id="reg-agree-error"
            :message="errorMessage"
            :visible="showErrorAfterSubmitOrTouch(meta, errorMessage)"
          />
        </div>
      </Field>
    </div>

    <div class="registration-page__actions">
      <button
        type="submit"
        class="member-form__submit"
        :disabled="isSubmitting"
        :aria-busy="isSubmitting"
      >
        <span v-if="isSubmitting">確認中…</span>
        <span v-else>確認する</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// ==========================================================================
// Imports
// ==========================================================================

import { Field, useFormContext, useFormValues } from 'vee-validate'
import type { FieldBindingObject, FieldMeta } from 'vee-validate'
import { computed, ref } from 'vue'
import { NEWSLETTER_CHOICES } from '~/constants/newsletter'
import { PREFECTURES } from '~/constants/prefectures'
import { suggestEmailDomains } from '~/utils/emailSuggestions'
import { formatJapanesePhone } from '~/utils/formatPhone'
import { formatZipCode, zipDigits } from '~/utils/formatZip'
import type { ZipCloudResponse } from '~/types/zipcloud'

// ==========================================================================
// Composables & state
// ==========================================================================

const { submitCount, setFieldValue, isSubmitting } = useFormContext()
const formValues = useFormValues<{
  email?: string
}>()

const prefectureOptions = PREFECTURES.map((p) => ({ value: p, label: p }))
const zipLookupBusy = ref(false)
const newsletterOptions = [...NEWSLETTER_CHOICES]

// ==========================================================================
// Computed
// ==========================================================================

const emailSuggestions = computed(() =>
  suggestEmailDomains(String(formValues.value.email ?? ''), 4),
)

// ==========================================================================
// Methods（aria-describedby 用の id 連結）
// ==========================================================================

function errorOnlyDescribedBy(baseId: string, hasError: boolean) {
  return hasError ? `${baseId}-error` : undefined
}

function phoneDescribedBy(hasError: boolean) {
  const ids = ['reg-phone-sr']
  if (hasError) ids.push('reg-phone-error')
  return ids.join(' ')
}

function zipDescribedBy(hasError: boolean) {
  const ids = ['reg-zip-sr']
  if (hasError) ids.push('reg-zip-error')
  return ids.join(' ')
}

function passwordDescribedBy(hasError: boolean) {
  const ids = ['reg-password-hint', 'reg-password-strength']
  if (hasError) ids.push('reg-password-error')
  return ids.join(' ')
}

/**
 * FormFieldShell の vis() と同じ条件（Field 直書きのメルマガ・同意用）
 */
function showErrorAfterSubmitOrTouch(meta: FieldMeta<unknown>, message?: string | null) {
  return !!(message && (submitCount.value > 0 || meta.touched))
}

/**
 * ZipCloud で都道府県〜町名を埋める。レスポンスが text/plain のときは JSON にパースする。
 */
async function fetchAndApplyZipAddress(zipRaw: string) {
  const digits = zipDigits(zipRaw)
  if (digits.length !== 7) return
  try {
    const raw = await $fetch<string | ZipCloudResponse>('https://zipcloud.ibsnet.co.jp/api/search', {
      params: { zipcode: digits },
    })
    const res =
      typeof raw === 'string' ? (JSON.parse(raw) as ZipCloudResponse) : raw
    if (Number(res.status) !== 200 || !res.results?.[0]) return
    const r = res.results[0]
    setFieldValue('prefecture', r.address1)
    setFieldValue('city', r.address2)
    setFieldValue('town', r.address3 ?? '')
  } catch {
    // 失敗時は手入力のまま
  }
}

async function onZipConvertClick(field: FieldBindingObject<string>) {
  zipLookupBusy.value = true
  try {
    await fetchAndApplyZipAddress(field.value ?? '')
  } finally {
    zipLookupBusy.value = false
  }
}

function applyEmailSuggestion(field: FieldBindingObject<string>, email: string) {
  field.onChange(email)
}
</script>
