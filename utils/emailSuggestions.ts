const COMMON_DOMAINS = [
  'gmail.com',
  'yahoo.co.jp',
  'icloud.com',
  'outlook.com',
  'hotmail.com',
  'docomo.ne.jp',
  'ezweb.ne.jp',
  'softbank.ne.jp',
] as const

/**
 * @ より前まで入力済みのとき、ドメイン候補を返す（最大 max 件）
 */
export function suggestEmailDomains(partial: string, max = 5): string[] {
  const trimmed = partial.trim()
  const at = trimmed.indexOf('@')
  if (at < 0) return []
  const local = trimmed.slice(0, at)
  const domainPart = trimmed.slice(at + 1).toLowerCase()
  if (!local) return []

  if (!domainPart) {
    return COMMON_DOMAINS.slice(0, max).map((d) => `${local}@${d}`)
  }

  return COMMON_DOMAINS.filter((d) => d.startsWith(domainPart))
    .map((d) => `${local}@${d}`)
    .slice(0, max)
}
