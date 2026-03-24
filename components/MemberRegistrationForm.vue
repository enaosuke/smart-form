<!--
  MemberRegistrationForm - 会員登録の本体

  vee-validate Form で入力〜確認を包み、完了パネルだけ Form 外に出す。
  親へ update:step で段階（edit / confirm / complete）を通知する。
-->
<template>
  <div class="member-form">
    <Form
      v-show="step !== 'complete'"
      class="member-form__form"
      :validation-schema="typedSchema"
      :initial-values="initialValues"
      :on-submit="onValidSubmit"
      :on-invalid-submit="onInvalidSubmit"
      :validate-on-mount="false"
      as="form"
    >
      <FormAutosave />
      <RegistrationFormFields v-show="step === 'edit'" />
      <RegistrationConfirmPanel
        v-if="step === 'confirm'"
        @back="goToEdit"
        @complete="goToComplete"
      />
    </Form>

    <RegistrationCompletePanel v-if="step === 'complete'" />
  </div>
</template>

<script setup lang="ts">
// ==========================================================================
// Imports
// ==========================================================================

import { Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { nextTick, ref, watch } from 'vue'
import type { SubmissionHandler } from 'vee-validate'
import { defaultRegistrationValues } from '~/constants/defaultRegistrationValues'
import { scrollToFirstInvalidField } from '~/composables/useForm'
import { registrationSchema, type RegistrationFormValues } from '~/schemas/registrationSchema'
import type { RegistrationFlowStep } from '~/types/registrationFlow'

// ==========================================================================
// Emits
// ==========================================================================

const emit = defineEmits<{
  'update:step': [value: RegistrationFlowStep]
}>()

// ==========================================================================
// State
// ==========================================================================

const typedSchema = toTypedSchema(registrationSchema)
const initialValues: RegistrationFormValues = { ...defaultRegistrationValues }
const step = ref<RegistrationFlowStep>('edit')

// ==========================================================================
// Watch
// ==========================================================================

watch(step, (v) => emit('update:step', v), { immediate: true })

// ==========================================================================
// Methods
// ==========================================================================

function scrollPageToTop() {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const onValidSubmit = (async () => {
  if (step.value !== 'edit') return
  step.value = 'confirm'
  await nextTick()
  scrollPageToTop()
  if (import.meta.client) {
    document.getElementById('reg-confirm-heading')?.focus()
  }
}) as SubmissionHandler

function onInvalidSubmit() {
  nextTick(() => scrollToFirstInvalidField())
}

function goToEdit() {
  step.value = 'edit'
  nextTick(() => {
    if (import.meta.client) {
      document.getElementById('reg-name')?.focus()
    }
    scrollPageToTop()
  })
}

function goToComplete() {
  step.value = 'complete'
  nextTick(() => {
    scrollPageToTop()
    if (import.meta.client) {
      document.getElementById('reg-complete-heading')?.focus()
    }
  })
}
</script>

<style scoped lang="scss">
.member-form__form {
  margin: 0;
}
</style>
