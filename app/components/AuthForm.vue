<script setup lang="ts">
  import type { AuthField } from "~/types/auth";

  const { fields, loading, path, mainButtonLabel, secondaryButtonLabel } = defineProps<{
    fields: AuthField[];
    loading?: boolean;
    path: string;
    mainButtonLabel: string;
    secondaryButtonLabel: string;
  }>();

  const emit = defineEmits(["handleButton"]);
  const { isLoading } = useAuth();
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
        <small v-if="field.error && field.errorMessage" class="error-message">
          {{ field.errorMessage }}
        </small>
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
        <small v-if="field.error && field.errorMessage" class="error-message">
          {{ field.errorMessage }}
        </small>
      </span>
    </div>
    <div class="auth-buttons">
      <Button
        type="submit"
        :label="mainButtonLabel"
        :loading="isLoading"
        :disabled="isLoading"
        class="auth-button"
        @click="emit('handleButton')" />
      <Button
        link
        :label="secondaryButtonLabel"
        class="link-button"
        @click="navigateTo(`/auth/${path}`)" />
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
    margin-bottom: 0.5rem;
  }

  .error-message {
    color: #c63031;
    font-size: 0.75rem;
    margin-top: 0.25rem;
    display: block;
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

  .custom-input:focus {
    border-color: #c63031 !important;
    box-shadow: 0 0 0 2px rgba(198, 48, 49, 0.1) !important;
    outline: none !important;
  }

  .custom-password :deep(.p-password) {
    width: 100%;
    display: flex;
    position: relative;
  }

  .custom-password :deep(.p-password input) {
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

  .custom-password :deep(.p-password input:focus) {
    border: 2px solid #c63031 !important;
    box-shadow: 0 0 0 2px rgba(198, 48, 49, 0.1) !important;
    outline: none !important;
  }

  .custom-password :deep(.p-password-input::placeholder) {
    color: #bbb !important;
    opacity: 1 !important;
  }

  .custom-password :deep(.p-password-toggle-mask-icon) {
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

  .custom-password :deep(.p-password-toggle-mask-icon:hover) {
    color: #666 !important;
  }

  .custom-password :deep(.p-password-mask) {
    display: none;
  }
  .auth-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
  }

  .auth-button {
    width: 220px;
    padding: 1rem;
    background-color: #c63031;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(198, 48, 49, 0.2);
  }

  .auth-button:hover:not(:disabled) {
    background-color: #b52b2b;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(198, 48, 49, 0.3);
  }

  .auth-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .auth-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .auth-links {
    text-align: center;
    margin-top: 1rem;
    width: 100%;
  }

  .link-button {
    color: #999 !important;
    padding: 1rem;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  .link-button:hover {
    color: #666 !important;
  }

  .link-button :deep(.p-button-label) {
    font-weight: 500;
    font-size: 0.85rem;
  }
</style>
