<script setup lang="ts"></script>

<template>
  <section class="section">
    <PageTabs :tabs="['login', 'register']" centered class="tabs">
      <NuxtPage />
    </PageTabs>
  </section>
</template>

<style scoped>
  .tabs {
    display: flex;
  }
</style>
