import type { Meta, StoryObj } from '@storybook/vue3'
import BaseLabel from './BaseLabel.vue'

const meta: Meta<typeof BaseLabel> = {
  title: 'Form/BaseLabel',
  component: BaseLabel,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Required: Story = {
  args: {
    htmlFor: 'f-name',
    label: 'お名前',
    required: true,
  },
}

export const Plain: Story = {
  args: {
    htmlFor: 'f-phone',
    label: '電話番号',
  },
}
