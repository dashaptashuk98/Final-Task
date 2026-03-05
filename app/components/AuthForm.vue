<script setup lang="ts">
  import type { AuthField } from "~/types/auth";

  defineProps<{
    fields: AuthField[];
    buttonText: string;
    loading?: boolean;
  }>();
</script>

<template>
  <div class="auth-form">
    <div v-for="field in fields" :key="field.key" class="form-group">
      <span v-if="field.type === 'email' || field.type === 'text'" class="input-wrapper">
        <InputText
          :id="field.key"
          v-model="field.value"
          :class="{ 'p-invalid': field.error }"
          :disabled="loading"
          :placeholder="field.placeholder"
          class="custom-input" />
      </span>

      <span v-if="field.type === 'password'" class="password-wrapper">
        <Password
          :id="field.key"
          v-model="field.value"
          :feedback="false"
          toggle-mask
          :class="{ 'p-invalid': field.error }"
          :disabled="loading"
          :placeholder="field.placeholder"
          class="custom-password"
          :input-style="{ width: '100%' }"
          :pt="{
            input: {
              style: field.error ? { borderColor: '#c63031 !important' } : {},
            },
          }" />
      </span>
    </div>
  </div>
</template>

<style scoped>
  .auth-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }

  .form-group {
    width: 100%;
  }

  .input-wrapper,
  .password-wrapper {
    display: block;
    width: 100%;
  }

  .custom-input,
  .custom-password {
    width: 100%;
    border: 1px solid #0000003b;
    padding: 0.9rem 1rem !important;
    border-radius: 8px !important;
    font-size: 1rem !important;
    transition: all 0.3s ease !important;
    background-color: white !important;
    font-family: inherit !important;
    box-sizing: border-box !important;
  }

  .custom-input::placeholder {
    color: #bbb;
  }

  .custom-input:deep(.p-inputtext:focus) {
    border-color: #c63031 !important;
    box-shadow: 0 0 0 2px rgba(198, 48, 49, 0.1) !important;
    outline: none !important;
  }

  /* Красная обводка для email при ошибке */
  .custom-input:deep(.p-inputtext.p-invalid) {
    border-color: #c63031 !important;
  }

  .custom-password:deep(.p-password) {
    width: 100%;
    display: flex;
    position: relative;
  }

  .custom-password:deep(.p-password input) {
    width: 100% !important;
    padding: 0.9rem 3rem 0.9rem 1rem !important;
    border: 2px solid #e0e0e0 !important;
    border-radius: 8px !important;
    font-size: 1rem !important;
    transition: all 0.3s ease !important;
    background-color: white !important;
    font-family: inherit !important;
    box-sizing: border-box !important;
  }

  .custom-password:deep(.p-password input:focus) {
    border-color: #c63031 !important;
    box-shadow: 0 0 0 2px rgba(198, 48, 49, 0.1) !important;
    outline: none !important;
  }

  .custom-password:deep(.p-password-input::placeholder) {
    color: #bbb !important;
    opacity: 1 !important;
  }

  .custom-password:deep(.p-password-toggle-mask-icon) {
    position: absolute !important;
    right: 1rem !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    color: #999 !important;
    cursor: pointer !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    z-index: 2 !important;
    width: 1.5rem !important;
    height: 1.5rem !important;
    margin-top: 0 !important;
    inset-inline-end: 1rem !important;
  }

  .custom-password:deep(.p-password-toggle-mask-icon:hover) {
    color: #666 !important;
  }

  .custom-password:deep(.p-password-mask) {
    display: none;
  }
</style>
