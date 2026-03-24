import type { Preview } from '@storybook/vue3'
import { configure } from 'vee-validate'
import '../assets/styles/form.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'

configure({
  validateOnBlur: true,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false,
})

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    backgrounds: {
      default: 'light',
      values: [{ name: 'light', value: '#ffffff' }],
    },
  },
}

export default preview
