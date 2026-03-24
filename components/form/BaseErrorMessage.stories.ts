import type { Meta, StoryObj } from '@storybook/vue3'
import BaseErrorMessage from './BaseErrorMessage.vue'

const meta: Meta<typeof BaseErrorMessage> = {
  title: 'Form/BaseErrorMessage',
  component: BaseErrorMessage,
  tags: ['autodocs'],
}

export default meta
type StoryObjType = StoryObj<typeof meta>

export const Visible: StoryObjType = {
  args: {
    messageId: 'err-1',
    message: '具体的で次の行動が分かるエラー文をここに書きます。',
    visible: true,
  },
}

export const Hidden: StoryObjType = {
  args: {
    messageId: 'err-2',
    message: '非表示',
    visible: false,
  },
}
