import type { Meta, StoryObj } from '@storybook/vue3'
import PasswordStrengthMeter from './PasswordStrengthMeter.vue'

const meta: Meta<typeof PasswordStrengthMeter> = {
  title: 'Form/PasswordStrengthMeter',
  component: PasswordStrengthMeter,
  tags: ['autodocs'],
  argTypes: {
    password: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    password: '',
    labelId: 'pw-strength-empty',
  },
}

export const Weak: Story = {
  args: {
    password: 'abc',
    labelId: 'pw-strength-weak',
  },
}

export const Medium: Story = {
  args: {
    password: 'abcABC12',
    labelId: 'pw-strength-mid',
  },
}

export const Strong: Story = {
  args: {
    password: 'aB3!xY9zQ2wE7rT',
    labelId: 'pw-strength-strong',
  },
}

export const CompareLevels: Story = {
  render: () => ({
    components: { PasswordStrengthMeter },
    template: `
      <div style="display:grid;gap:20px;max-width:400px">
        <div>
          <p style="margin:0 0 6px;font-size:12px;color:#718096">未入力</p>
          <PasswordStrengthMeter password="" label-id="cmp-0" />
        </div>
        <div>
          <p style="margin:0 0 6px;font-size:12px;color:#718096">弱い</p>
          <PasswordStrengthMeter password="pass" label-id="cmp-1" />
        </div>
        <div>
          <p style="margin:0 0 6px;font-size:12px;color:#718096">やや強い</p>
          <PasswordStrengthMeter password="MyP@ssw0rd!" label-id="cmp-2" />
        </div>
      </div>
    `,
  }),
}
