import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import BaseTextarea from './BaseTextarea.vue'

const meta: Meta<typeof BaseTextarea> = {
  title: 'Form/BaseTextarea',
  component: BaseTextarea,
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
    components: { BaseTextarea },
    setup() {
      const v = ref('')
      return { v }
    },
    template: `
      <BaseTextarea
        v-model="v"
        name="demo-purpose"
        textarea-id="demo-purpose"
        placeholder="利用目的"
        :rows="4"
      />
      <p style="margin-top:10px;font-size:12px;color:#718096">文字数: {{ v.length }}</p>
    `,
  }),
}

export const ErrorState: Story = {
  render: () => ({
    components: { BaseTextarea },
    setup() {
      const v = ref('短い')
      return { v }
    },
    template: `
      <BaseTextarea
        v-model="v"
        name="demo-purpose-err"
        textarea-id="demo-purpose-err"
        placeholder="利用目的"
        :has-error="true"
        :aria-invalid="true"
        described-by="demo-purpose-err-msg"
      />
      <p id="demo-purpose-err-msg" role="alert" style="margin-top:8px;font-size:13px;color:#c53030">
        もう少し詳しく入力してください
      </p>
    `,
  }),
}

export const StaticLabel: Story = {
  render: () => ({
    components: { BaseTextarea },
    setup() {
      const v = ref('フローティングラベルOFFの例です。')
      return { v }
    },
    template: `
      <BaseTextarea
        v-model="v"
        name="demo-purpose-static"
        textarea-id="demo-purpose-static"
        placeholder="コメント"
        :floating-label="false"
        :rows="3"
      />
    `,
  }),
}
