import type { Meta, StoryObj } from '@storybook/vue3'
import { Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { useFormValues } from 'vee-validate'
import { defineComponent } from 'vue'
import FormAutosave from './FormAutosave.vue'
import { REGISTRATION_STORAGE_KEY } from '~/composables/useForm'
import { defaultRegistrationValues } from '~/constants/defaultRegistrationValues'
import { registrationSchema, type RegistrationFormValues } from '~/schemas/registrationSchema'

const typedSchema = toTypedSchema(registrationSchema)

const FormValuesDebug = defineComponent({
  name: 'FormValuesDebug',
  setup() {
    const values = useFormValues<RegistrationFormValues>()
    return { values }
  },
  template: `
    <pre
      style="margin-top:16px;padding:12px;background:#f7fafc;border-radius:8px;font-size:11px;overflow:auto;max-height:280px"
    >{{ JSON.stringify(values, null, 2) }}</pre>
    <p style="margin-top:8px;font-size:12px;color:#718096">
      FormAutosave はマウント時に LocalStorage を読み、既知フィールドだけマージします。入力は会員登録フィールドのストーリーと組み合わせて確認できます。
    </p>
  `,
})

const meta: Meta<typeof FormAutosave> = {
  title: 'Form/FormAutosave',
  component: FormAutosave,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '見た目はありません。マウント時に LocalStorage から下書きを復元し、値の変更をデバウンス保存します。vee-validate の Form 内でのみ動作します。',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const ClearsStorageThenEmptyForm: Story = {
  render: () => ({
    components: { Form, FormAutosave, FormValuesDebug },
    setup() {
      try {
        localStorage.removeItem(REGISTRATION_STORAGE_KEY)
      } catch {
        /* ストレージ不可環境 */
      }
      const initialValues: RegistrationFormValues = { ...defaultRegistrationValues }
      return { typedSchema, initialValues }
    },
    template: `
      <Form
        :validation-schema="typedSchema"
        :initial-values="initialValues"
        as="div"
        :validate-on-mount="false"
      >
        <FormAutosave />
        <FormValuesDebug />
      </Form>
    `,
  }),
}

export const MergesKnownKeysFromLocalStorage: Story = {
  render: () => ({
    components: { Form, FormAutosave, FormValuesDebug },
    setup() {
      try {
        localStorage.setItem(
          REGISTRATION_STORAGE_KEY,
          JSON.stringify({
            name: '下書きの氏名',
            email: 'draft@example.com',
            unknownField: '無視される',
          }),
        )
      } catch {
        /* ストレージ不可環境 */
      }
      const initialValues: RegistrationFormValues = { ...defaultRegistrationValues }
      return { typedSchema, initialValues }
    },
    template: `
      <Form
        :validation-schema="typedSchema"
        :initial-values="initialValues"
        as="div"
        :validate-on-mount="false"
      >
        <FormAutosave />
        <FormValuesDebug />
      </Form>
    `,
  }),
}
