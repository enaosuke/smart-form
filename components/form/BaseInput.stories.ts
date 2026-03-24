import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import BaseInput from './BaseInput.vue'

const meta: Meta<typeof BaseInput> = {
  title: 'Form/BaseInput',
  component: BaseInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { BaseInput },
    setup() {
      const v = ref('')
      return { v }
    },
    template: `
      <div style="width:min(100%,360px)">
        <BaseInput
          name="demo"
          input-id="demo-input"
          :model-value="v"
          placeholder="プレースホルダー"
          @update:model-value="v = $event"
        />
        <p style="margin-top:8px;font-size:12px;color:#718096">値: {{ v || '（空）' }}</p>
      </div>
    `,
  }),
}

export const ErrorState: Story = {
  render: () => ({
    components: { BaseInput },
    setup() {
      const v = ref('12')
      return { v }
    },
    template: `
      <div style="width:min(100%,360px)">
        <BaseInput
          name="demo"
          input-id="demo-input-err"
          :model-value="v"
          :has-error="true"
          :aria-invalid="true"
          described-by="demo-err"
          show-clear
          @update:model-value="v = $event"
        />
        <p id="demo-err" role="alert" style="margin-top:8px;font-size:13px;color:#c53030">例: エラーメッセージ</p>
      </div>
    `,
  }),
}

export const SuccessState: Story = {
  args: {
    name: 'demo',
    inputId: 'demo-ok',
    modelValue: '入力済み',
    showSuccess: true,
  },
}
