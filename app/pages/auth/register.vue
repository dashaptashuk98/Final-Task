<template>
  <div class="register-page">
    <TabComponent />
  </div>
</template>

<script setup lang="ts">
  import TabComponent from "~/components/TabComponent.vue";
  definePageMeta({
    layout: false,
  });
</script>
<style scoped>
  .register-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    font-family: "Inter", "Roboto", "Open Sans", sans-serif;
    padding: 2rem 1rem 0;
  }
</style>
