<template>
  <div class="auth-page">
    <div class="auth-content">
      <AuthDescription title="Sign up" description="Hello! Create an account to continue" />
      <AuthForm
        :fields="loginFields"
        main-button-label="CREATE ACCOUNT"
        secondary-button-label="I HAVE AN ACCOUNT"
        :loading="isLoading"
        path="login"
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
</style>
