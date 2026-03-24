import type { Meta, StoryObj } from '@storybook/vue3'
import { Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import RegistrationConfirmPanel from './RegistrationConfirmPanel.vue'
import { defaultRegistrationValues } from '~/constants/defaultRegistrationValues'
import { registrationSchema, type RegistrationFormValues } from '~/schemas/registrationSchema'

const typedSchema = toTypedSchema(registrationSchema)

const demoValues: RegistrationFormValues = {
  ...defaultRegistrationValues,
  name: '山田 太郎',
  nameKana: 'やまだ たろう',
  email: 'yamada@example.com',
  phone: '09012345678',
  zipCode: '1000001',
  prefecture: '東京都',
  city: '千代田区',
  town: '千代田',
  street: '1-1',
  addressOther: 'サンプルビル 101',
  newsletter: 'receive',
  purpose: 'Storybook デモ用の入力です。',
  password: 'Secret12!',
  passwordConfirm: 'Secret12!',
  agreeTerms: true,
}

const meta: Meta<typeof RegistrationConfirmPanel> = {
  title: 'Registration/RegistrationConfirmPanel',
  component: RegistrationConfirmPanel,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div class="registration-page" style="max-width:720px;margin:0 auto"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Form, RegistrationConfirmPanel },
    setup() {
      return {
        typedSchema,
        initialValues: { ...demoValues },
      }
    },
    template: `
      <Form
        :validation-schema="typedSchema"
        :initial-values="initialValues"
        as="div"
        :validate-on-mount="false"
      >
        <RegistrationConfirmPanel
          @back="() => {}"
          @complete="() => {}"
        />
      </Form>
    `,
  }),
}
