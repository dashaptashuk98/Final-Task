<template>
  <div class="auth-page">
    <div class="auth-content">
      <AuthDescription title="Welcome back" description="Glad to see you! Log in to continue" />
      <AuthForm
        :fields="loginFields"
        main-button-label="LOG IN"
        secondary-button-label="CREATE ACCOUNT"
        :loading="isLoading"
        path="signup"
        @handle-button="handleAuth" />
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: false,
  });
  const { isLoading } = useAuth();
  const { loginFields, handleAuth } = useValidateAuth();
</script>

<style scoped>
  .auth-page {
    min-height: calc(100vh - 82px);
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    font-family: "Inter", "Roboto", "Open Sans", sans-serif;
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
