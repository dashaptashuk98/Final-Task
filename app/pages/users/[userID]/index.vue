<script setup lang="ts">
  import type { Tabs } from "~/types/types";
  const route = useRoute();

  const tabs: Tabs[] = [
    { label: "profile", to: `/users/${route.params.userID}/profile` },
    { label: "skills", to: `/users/${route.params.userID}/skills` },
    { label: "languages", to: `/users/${route.params.userID}/languages` },
  ];
</script>

<template>
  <section class="section">
    <PageTabs :tabs="tabs">
      <NuxtPage />
    </PageTabs>
  </section>
</template>
