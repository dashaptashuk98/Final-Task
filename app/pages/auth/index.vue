<script setup lang="ts">
  import type { Tabs } from "~/types/types";

  const tabs: Tabs[] = [
    { label: "login", to: "/auth/login" },
    { label: "register", to: "/auth/register" },
  ];
</script>

<template>
  <section class="section">
    <PageTabs :tabs="tabs" centered class="tabs">
      <NuxtPage />
    </PageTabs>
  </section>
</template>

<style scoped>
  .tabs {
    display: flex;
  }
</style>
