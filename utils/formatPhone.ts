/** 数字のみ抽出 */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/** 携帯・固定など国内番号向け: ハイフンなし、最大11桁 */
export function formatJapanesePhone(raw: string): string {
  return digitsOnly(raw).slice(0, 11)
}
