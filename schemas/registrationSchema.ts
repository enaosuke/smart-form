import * as yup from 'yup'

/** 実用的なメール形式（RFC 厳密ではない） */
const emailLoose =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

/** 国内番号（先頭0、ハイフンなし10〜11桁） */
const phoneDigitsPattern = /^0\d{9,10}$/

/** 氏名（かな）: ひらがな（U+3041–U+3096）・全角スペース・ASCIIスペース */
const nameKanaPattern = /^[\u3041-\u3096\u3000\s]+$/

export const registrationSchema = yup.object({
  name: yup
    .string()
    .transform((v) => (v ?? '').trim())
    .required('氏名を入力してください')
    .min(1, '氏名を入力してください'),

  nameKana: yup
    .string()
    .transform((v) => (v ?? '').trim())
    .required('氏名（かな）を入力してください')
    .matches(nameKanaPattern, 'ひらがなで入力してください'),

  email: yup
    .string()
    .transform((v) => (v ?? '').trim())
    .required('メールアドレスを入力してください')
    .matches(
      emailLoose,
      'メールアドレスに「@」とドメイン（example.com など）が含まれる形式で入力してください',
    ),

  phone: yup
    .string()
    .transform((v) => (v ?? '').trim())
    .test(
      'phone-format',
      '電話番号はハイフンなしの10桁または11桁の数字で入力してください（先頭は0）',
      (v) => !v || phoneDigitsPattern.test(v),
    ),

  zipCode: yup
    .string()
    .transform((v) => (v ?? '').trim())
    .test(
      'zip-format',
      '郵便番号はハイフンなしの7桁の数字で入力してください',
      (v) => !v || /^\d{7}$/.test(v),
    ),

  prefecture: yup.string().transform((v) => (v ?? '').trim()),
  city: yup.string().transform((v) => (v ?? '').trim()),
  town: yup.string().transform((v) => (v ?? '').trim()),
  street: yup.string().transform((v) => (v ?? '').trim()),
  addressOther: yup.string().transform((v) => (v ?? '').trim()),

  newsletter: yup
    .string()
    .oneOf(['receive', 'not_receive'], 'メルマガ配信の希望を選択してください')
    .required('メルマガ配信の希望を選択してください'),

  purpose: yup.string().transform((v) => (v ?? '').trim()),

  password: yup
    .string()
    .required('パスワードを入力してください')
    .min(8, 'パスワードは8文字以上で入力してください'),

  passwordConfirm: yup
    .string()
    .required('確認用パスワードを入力してください')
    .oneOf([yup.ref('password')], 'パスワードが一致しません。もう一度入力してください'),

  agreeTerms: yup
    .boolean()
    .required()
    .oneOf([true], '内容を確認のうえ、同意にチェックを入れてください'),
})

export type RegistrationFormValues = yup.InferType<typeof registrationSchema>
