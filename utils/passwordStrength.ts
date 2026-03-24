export type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong'

export interface PasswordStrengthResult {
  level: PasswordStrengthLevel
  score: number
  label: string
}

/**
 * ヒューリスティックな強度（実務向けの目安）
 */
export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { level: 'weak', score: 0, label: 'パスワードを入力してください' }
  }
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1

  if (score <= 1) return { level: 'weak', score, label: '弱い — 文字種や長さを増やしてください' }
  if (score === 2) return { level: 'fair', score, label: '普通 — まだ改善の余地があります' }
  if (score === 3) return { level: 'good', score, label: '良好' }
  return { level: 'strong', score, label: '強い' }
}
