<template>
  <div class="auth-page">
    <div class="auth-content">
      <h1 class="welcome-title">Забыли пароль</h1>
      <p class="welcome-subtitle">Мы вышлем вам на почту необходимые интсрукции</p>

      <AuthForm :fields="resetFields" button-text="СБРОС ПАРОЛЯ" :loading="isLoading" />
      <div class="button-wrapper">
        <Button
          type="submit"
          label="СБРОС ПАРОЛЯ"
          :loading="isLoading"
          :disabled="isLoading"
          class="auth-button" />
      </div>

      <div class="auth-links">
        <Button link label="ОТМЕНА" class="link-button" @click="navigateTo('/auth/login')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Button from "primevue/button";
  import AuthForm from "~/components/AuthForm.vue";
  import type { AuthField } from "~/types/auth";
  import { useAuth } from "~/composables/useAuth";

  definePageMeta({
    layout: false,
  });

  const { isLoading } = useAuth();

  const resetFields = ref<AuthField[]>([
    {
      key: "email",
      label: "Почта",
      type: "email" as const,
      value: "",
      placeholder: "Почта",
    },
  ]);
</script>

<style scoped>
  .auth-page {
    min-height: 100vh;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    font-family: "Inter", "Roboto", "Open Sans", sans-serif;
    padding: 2rem 1rem 0;
  }

  .auth-content {
    width: 100%;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto 0;
  }

  .welcome-title {
    font-size: 2rem;
    font-weight: 600;
    color: #2e2e2e;
    text-align: center;
    margin-bottom: 0.5rem;
    letter-spacing: -0.5px;
  }

  .welcome-subtitle {
    font-size: 1rem;
    color: #999;
    text-align: center;
    margin-bottom: 2rem;
    font-weight: 400;
  }

  .error-message {
    margin-bottom: 1.5rem;
    width: 100%;
  }

  .error-message :deep(.p-message) {
    background-color: #fee9e7;
    border: 1px solid #c63031;
    color: #c63031;
    border-radius: 8px;
    padding: 0.75rem 1rem;
  }

  .validation-errors {
    width: 100%;
    margin: 0.5rem 0;
  }

  .error-text {
    color: #c63031;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    text-align: left;
  }

  .button-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 1rem;
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

  @media (max-width: 480px) {
    .auth-page {
      padding: 1.5rem 1rem 0;
    }

    .auth-content {
      max-width: 100%;
    }

    .welcome-title {
      font-size: 1.75rem;
    }
  }
</style>
