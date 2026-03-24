// schema の oneOf と表示を一箇所に寄せる
export const NEWSLETTER_CHOICES = [
  { value: 'receive', label: '受け取る' },
  { value: 'not_receive', label: '受け取らない' },
] as const

export function newsletterChoiceLabel(value: string | undefined | null): string {
  if (value == null || value === '') return ''
  const hit = NEWSLETTER_CHOICES.find((c) => c.value === value)
  return hit?.label ?? value
}
