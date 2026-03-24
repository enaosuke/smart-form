import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import BaseRadioGroup from './BaseRadioGroup.vue'
import { NEWSLETTER_CHOICES } from '~/constants/newsletter'

const options = NEWSLETTER_CHOICES.map((c) => ({ value: c.value, label: c.label }))

const meta: Meta<typeof BaseRadioGroup> = {
  title: 'Form/BaseRadioGroup',
  component: BaseRadioGroup,
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
    components: { BaseRadioGroup },
    setup() {
      const v = ref('receive')
      return { v, options }
    },
    template: `
      <BaseRadioGroup
        v-model="v"
        name="demo-newsletter"
        group-id="demo-newsletter"
        legend="メルマガ配信"
        :options="options"
        required
      />
      <p style="margin-top:10px;font-size:12px;color:#718096">選択: {{ v }}</p>
    `,
  }),
}

export const WithHint: Story = {
  render: () => ({
    components: { BaseRadioGroup },
    setup() {
      const v = ref('')
      return { v, options }
    },
    template: `
      <BaseRadioGroup
        v-model="v"
        name="demo-newsletter-hint"
        group-id="demo-newsletter-hint"
        legend="メルマガ配信"
        hint="希望する方は「受け取る」を選んでください。"
        :options="options"
      />
    `,
  }),
}

export const ErrorState: Story = {
  render: () => ({
    components: { BaseRadioGroup },
    setup() {
      const v = ref('receive')
      return { v, options }
    },
    template: `
      <BaseRadioGroup
        v-model="v"
        name="demo-newsletter-err"
        group-id="demo-newsletter-err"
        legend="メルマガ配信"
        :options="options"
        :has-error="true"
        :aria-invalid="true"
        described-by="demo-newsletter-err-msg"
      />
      <p id="demo-newsletter-err-msg" role="alert" style="margin-top:8px;font-size:13px;color:#c53030">
        選択してください
      </p>
    `,
  }),
}
