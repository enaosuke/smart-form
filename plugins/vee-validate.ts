import { configure } from 'vee-validate'

/**
 * 入力中は検証しない（blur / submit 中心）
 * 各 Field の props でも上書き可能
 */
export default defineNuxtPlugin(() => {
  configure({
    validateOnBlur: true,
    validateOnChange: false,
    validateOnInput: false,
    validateOnModelUpdate: false,
  })
})
