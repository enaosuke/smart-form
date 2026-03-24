import type { Meta, StoryObj } from '@storybook/vue3'
import RegistrationCompletePanel from './RegistrationCompletePanel.vue'

const meta: Meta<typeof RegistrationCompletePanel> = {
  title: 'Registration/RegistrationCompletePanel',
  component: RegistrationCompletePanel,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div class="registration-page" style="max-width:720px;margin:0 auto"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
