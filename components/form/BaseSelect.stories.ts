import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import BaseSelect from './BaseSelect.vue'
import { PREFECTURES } from '~/constants/prefectures'

const options = PREFECTURES.slice(0, 8).map((p) => ({ value: p, label: p }))

const meta: Meta<typeof BaseSelect> = {
  title: 'Form/BaseSelect',
  component: BaseSelect,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="max-width:360px"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { BaseSelect },
    setup() {
      const v = ref<string | undefined>(undefined)
      return { v, options }
    },
    template: `
      <BaseSelect
        v-model="v"
        name="demo-pref"
        select-id="demo-pref"
        placeholder="都道府県を選択"
        :options="options"
      />
      <p style="margin-top:10px;font-size:12px;color:#718096">値: {{ v || '（未選択）' }}</p>
    `,
  }),
}

export const Selected: Story = {
  render: () => ({
    components: { BaseSelect },
    setup() {
      const v = ref('東京都')
      return { v, options }
    },
    template: `
      <BaseSelect
        v-model="v"
        name="demo-pref-sel"
        select-id="demo-pref-sel"
        placeholder="都道府県を選択"
        :options="options"
        required
      />
    `,
  }),
}

export const ErrorState: Story = {
  render: () => ({
    components: { BaseSelect },
    setup() {
      const v = ref('')
      return { v, options }
    },
    template: `
      <BaseSelect
        v-model="v"
        name="demo-pref-err"
        select-id="demo-pref-err"
        placeholder="都道府県を選択"
        :options="options"
        :has-error="true"
        :aria-invalid="true"
        described-by="demo-pref-err-msg"
      />
      <p id="demo-pref-err-msg" role="alert" style="margin-top:8px;font-size:13px;color:#c53030">
        都道府県を選んでください
      </p>
    `,
  }),
}
