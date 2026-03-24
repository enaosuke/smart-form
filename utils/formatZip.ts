function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** 7桁までの数字のみ（ハイフンなし） */
export function formatZipCode(raw: string): string {
  return onlyDigits(raw).slice(0, 7)
}

export function zipDigits(raw: string): string {
  return onlyDigits(raw)
}
