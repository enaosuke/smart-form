import { onMounted, watch, type Ref } from 'vue'
import { defaultRegistrationValues } from '~/constants/defaultRegistrationValues'
import type { RegistrationFormValues } from '~/schemas/registrationSchema'

export const REGISTRATION_STORAGE_KEY = 'smart-form:registration:v1'

const registrationDraftKeys = Object.keys(defaultRegistrationValues) as (keyof RegistrationFormValues)[]

/**
 * LocalStorage の下書きから、フォームが解釈できる形だけ取り出す（未知キー・型崩れを捨てる）
 */
export function pickSanitizedRegistrationDraft(
  draft: Record<string, unknown>,
): Partial<RegistrationFormValues> {
  const out: Partial<RegistrationFormValues> = {}
  for (const key of registrationDraftKeys) {
    if (!Object.prototype.hasOwnProperty.call(draft, key)) continue
    const raw = draft[key as string]
    if (key === 'agreeTerms') {
      out.agreeTerms = raw === true || raw === 'true'
      continue
    }
    if (typeof raw === 'string') {
      ;(out as Record<string, unknown>)[key] = raw
    }
  }
  return out
}

/** SSR とハイドレーション時は使わず、クライアントの onMounted でのみ呼ぶ */
export function parseRegistrationDraftFromStorage(): Record<string, unknown> | null {
  if (import.meta.server) return null
  try {
    const raw = localStorage.getItem(REGISTRATION_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
}

/**
 * 会員登録フォームの永続化（LocalStorage）
 * vee-validate の values Ref と組み合わせて使う
 * ※ vee-validate の `useForm` とは別（本プロジェクトの状態管理用）
 */
export function useFormPersistence<T extends Record<string, unknown>>(values: Ref<T>) {
  let timer: ReturnType<typeof setTimeout> | null = null
  const debounceMs = 450

  function load(): Partial<T> | null {
    if (import.meta.server) return null
    try {
      const raw = localStorage.getItem(REGISTRATION_STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw) as Partial<T>
    } catch {
      return null
    }
  }

  function saveNow() {
    if (import.meta.server) return
    try {
      localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(values.value))
    } catch {
      /* プライベートモード等 */
    }
  }

  function clearStorage() {
    if (import.meta.server) return
    localStorage.removeItem(REGISTRATION_STORAGE_KEY)
  }

  function scheduleSave() {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      saveNow()
      timer = null
    }, debounceMs)
  }

  onMounted(() => {
    watch(values, scheduleSave, { deep: true })
  })

  return {
    load,
    saveNow,
    clearStorage,
  }
}

/** 要件の composables/useForm（LocalStorage 同期のエントリ） */
export function useForm<T extends Record<string, unknown>>(values: Ref<T>) {
  return useFormPersistence(values)
}

/**
 * 送信失敗時に最初のエラー項目へスクロール
 */
export function scrollToFirstInvalidField() {
  if (import.meta.server) return
  requestAnimationFrame(() => {
    const el = document.querySelector('[data-invalid="true"]') as HTMLElement | null
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}
