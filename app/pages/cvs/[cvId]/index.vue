<script setup lang="ts">
  import type { Tabs } from "~/types/types";

  definePageMeta({
    middleware: "auth",
  });
  const route = useRoute();

  const tabs: Tabs[] = [
    { label: "details", to: `/cvs/${route.params.cvId}/details` },
    { label: "skills", to: `/cvs/${route.params.cvId}/skills` },
    { label: "projects", to: `/cvs/${route.params.cvId}/projects` },
    { label: "preview", to: `/cvs/${route.params.cvId}/preview` },
  ];
</script>

<template>
  <section class="section">
    <PageTabs :tabs="tabs">
      <NuxtPage />
    </PageTabs>
  </section>
</template>
