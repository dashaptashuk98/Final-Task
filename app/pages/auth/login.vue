<template>
  <div class="auth-page">
    <TabComponent />
    <div class="auth-content">
      <h1 class="welcome-title">С возвращением</h1>
      <p class="welcome-subtitle">Рады вас видеть! Войдите, чтобы продолжить</p>

      <Message v-if="authStore.error" severity="error" :closable="false" class="error-message">
        {{ authStore.error }}
      </Message>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <span class="input-wrapper">
            <InputText
              id="email"
              v-model="credentials.email"
              :class="{ 'p-invalid': authStore.error && !credentials.email }"
              :disabled="authStore.isLoading"
              placeholder="Почта"
              class="custom-input" />
          </span>
        </div>

        <div class="form-group">
          <span class="password-wrapper">
            <Password
              id="password"
              v-model="credentials.password"
              :feedback="false"
              toggle-mask
              :class="{ 'p-invalid': authStore.error && !credentials.password }"
              :disabled="authStore.isLoading"
              placeholder="Пароль"
              class="custom-password"
              :input-style="{ width: '100%' }" />
          </span>
        </div>

        <div class="button-wrapper">
          <Button
            type="submit"
            label="ВОЙТИ"
            :loading="authStore.isLoading"
            :disabled="authStore.isLoading"
            class="auth-button" />
        </div>

        <div class="auth-links">
          <Button
            link
            label="СОЗДАТЬ АККАУНТ"
            class="link-button"
            @click="navigateTo('/auth/register')" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useToast } from "primevue/usetoast";
  import InputText from "primevue/inputtext";
  import Password from "primevue/password";
  import Button from "primevue/button";
  import Message from "primevue/message";
  import TabComponent from "~/components/TabComponent.vue";
  import { useAuthStore } from "../../../stores/auth";

  definePageMeta({
    layout: false,
  });

  const authStore = useAuthStore();
  const toast = useToast();
  const router = useRouter();

  const credentials = reactive({
    email: "",
    password: "",
  });

  async function handleLogin() {
    if (!credentials.email || !credentials.password) {
      authStore.error = "Пожалуйста, заполните все поля";
      return;
    }

    const result = await authStore.login(credentials);

    if (result.success) {
      toast.add({
        severity: "success",
        summary: "Успешно",
        detail: "Вы вошли в систему",
        life: 3000,
      });
      await router.push("/employee");
    } else {
      toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: result.error,
        life: 5000,
      });
    }
  }
</script>

<style scoped>
  .auth-page {
    min-height: 100vh;
    display: flex;
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

  .custom-input :deep(.p-inputtext:focus) {
    border-color: #c63031 !important;
    box-shadow: 0 0 0 2px rgba(198, 48, 49, 0.1) !important;
    outline: none !important;
  }

  /* Invalid состояние */
  .custom-input :deep(.p-inputtext.p-invalid) {
    border-color: #c63031 !important;
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
    border-color: #c63031 !important;
    box-shadow: 0 0 0 2px rgba(198, 48, 49, 0.1) !important;
    outline: none !important;
  }

  .custom-password :deep(.p-password input.p-invalid) {
    border-color: #c63031 !important;
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

  .p-password-toggle:hover {
    color: #666 !important;
  }

  .custom-password :deep(.p-password-mask) {
    display: none;
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

    .tabs-container {
      max-width: 100%;
    }

    .auth-content {
      max-width: 100%;
    }

    .welcome-title {
      font-size: 1.75rem;
    }

    .auth-tabs :deep(.p-tab) {
      font-size: 0.95rem;
    }
  }
</style>
