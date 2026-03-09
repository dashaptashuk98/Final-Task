<script setup lang="ts">
  const { title, description } = defineProps<{ title: string; description: string }>();
</script>

<template>
  <h1 class="welcome-title">{{ title }}</h1>
  <p class="welcome-subtitle">{{ description }}</p>
</template>

<style scoped>
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
</style>
