import type { RegistrationFormValues } from '~/schemas/registrationSchema'

/** 初期・リセット用（newsletter は未選択の空文字から開始） */
export const defaultRegistrationValues = {
  name: '',
  nameKana: '',
  email: '',
  phone: '',
  zipCode: '',
  prefecture: '',
  city: '',
  town: '',
  street: '',
  addressOther: '',
  newsletter: '',
  purpose: '',
  password: '',
  passwordConfirm: '',
  agreeTerms: false,
} as unknown as RegistrationFormValues
