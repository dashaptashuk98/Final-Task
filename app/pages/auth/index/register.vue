<template>
  <div class="auth-page">
    <div class="auth-content">
      <h1 class="welcome-title">Создание аккаунта</h1>
      <p class="welcome-subtitle">Заполните данные для регистрации</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: false,
  });
</script>

<style scoped>
  .auth-page {
    min-height: 100vh;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 2rem 1rem 0;
  }

  .auth-content {
    width: 100%;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto 0;
  }

  .welcome-title {
    font-size: 2rem;
    font-weight: 600;
    color: #2e2e2e;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
    color: #999;
    text-align: center;
    margin-bottom: 2rem;
  }
</style>
