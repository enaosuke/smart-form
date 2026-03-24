import type { Meta, StoryObj } from '@storybook/vue3'
import { Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import FormFieldShell from './FormFieldShell.vue'
import BaseLabel from './BaseLabel.vue'
import BaseInput from './BaseInput.vue'
import BaseErrorMessage from './BaseErrorMessage.vue'

const schema = toTypedSchema(
  yup.object({
    demoName: yup.string().required('デモ: 名前を入力してください'),
  }),
)

const meta: Meta<typeof FormFieldShell> = {
  title: 'Form/FormFieldShell',
  component: FormFieldShell,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="max-width:360px;padding:16px"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const WithVeeForm: Story = {
  render: () => ({
    components: { Form, FormFieldShell, BaseLabel, BaseInput, BaseErrorMessage },
    setup() {
      return { schema }
    },
    template: `
      <Form
        :validation-schema="schema"
        :initial-values="{ demoName: '' }"
        :validate-on-mount="false"
        as="form"
        :on-submit="() => window.alert('送信OK（デモ）')"
        :on-invalid-submit="() => {}"
      >
        <FormFieldShell name="demoName">
          <template #default="{ field, errorMessage, showError, showSuccess }">
            <BaseLabel html-for="demo-name" label="デモフィールド" required />
            <BaseInput
              name="demoName"
              input-id="demo-name"
              :model-value="field.value"
              :has-error="showError"
              :show-success="showSuccess"
              :aria-invalid="showError"
              :described-by="showError ? 'demo-name-error' : undefined"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
            <BaseErrorMessage
              message-id="demo-name-error"
              :message="errorMessage"
              :visible="showError"
            />
          </template>
        </FormFieldShell>
        <button type="submit" class="member-form__submit" style="margin-top:16px">
          送信して検証
        </button>
      </Form>
    `,
  }),
}
