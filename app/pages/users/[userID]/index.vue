<script setup lang="ts">
  import type { Tabs } from "~/types/types";
  definePageMeta({
    middleware: "auth",
  });
  const route = useRoute();

  const tabs: Tabs[] = [
    { label: "profile", to: `/users/${route.params.userID}/profile` },
    { label: "skills", to: `/users/${route.params.userID}/skills` },
    { label: "languages", to: `/users/${route.params.userID}/languages` },
    { label: "cvs", to: `/users/${route.params.userID}/cvs` },
  ];
</script>

<template>
  <section class="section">
    <PageTabs :tabs="tabs">
      <NuxtPage />
    </PageTabs>
  </section>
</template>
