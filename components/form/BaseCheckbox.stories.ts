import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import BaseCheckbox from './BaseCheckbox.vue'

const meta: Meta<typeof BaseCheckbox> = {
  title: 'Form/BaseCheckbox',
  component: BaseCheckbox,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="max-width:420px"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { BaseCheckbox },
    setup() {
      const checked = ref(false)
      return { checked }
    },
    template: `
      <BaseCheckbox
        name="demo-agree"
        input-id="demo-agree"
        v-model="checked"
      >
        利用規約に同意します
      </BaseCheckbox>
      <p style="margin-top:10px;font-size:12px;color:#718096">状態: {{ checked ? 'ON' : 'OFF' }}</p>
    `,
  }),
}

export const ErrorState: Story = {
  render: () => ({
    components: { BaseCheckbox },
    setup() {
      const checked = ref(false)
      return { checked }
    },
    template: `
      <BaseCheckbox
        name="demo-agree-err"
        input-id="demo-agree-err"
        v-model="checked"
        :has-error="true"
        :aria-invalid="true"
        described-by="demo-agree-err-msg"
      >
        内容を確認のうえ同意します
      </BaseCheckbox>
      <p id="demo-agree-err-msg" role="alert" style="margin-top:8px;font-size:13px;color:#c53030">
        同意が必要です
      </p>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    name: 'demo-agree-dis',
    inputId: 'demo-agree-dis',
    modelValue: true,
    disabled: true,
  },
  render: (args) => ({
    components: { BaseCheckbox },
    setup() {
      return { args }
    },
    template: `
      <BaseCheckbox v-bind="args">
        無効状態（チェック済み）
      </BaseCheckbox>
    `,
  }),
}
