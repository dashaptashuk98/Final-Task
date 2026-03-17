<template>
  <div class="app-layout">
    <SidebarMenu />
    <main class="main-content">
      <HeaderComponent />
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  import SidebarMenu from "~/components/SidebarMenu.vue";

  useHead({
    bodyAttrs: {
      class: "layout-default",
    },
  });
</script>

<style scoped>
  .app-layout {
    display: flex;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    margin-left: 200px;
    padding: 16px;
    background: white;
    min-height: 100vh;
    transition: margin-left 0.3s ease;
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 60px;
      padding: 1rem;
    }
  }
</style>
