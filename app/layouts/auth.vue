<script setup lang="ts">
  import { useRoute, useRouter } from "vue-router";

  const route = useRoute();
  const router = useRouter();

  const tabs = ["login", "register"] as const;
  type TabType = (typeof tabs)[number];

  const currentTab = computed({
    get: (): TabType => {
      const path = route.path;
      if (path.includes("/auth/login")) return "login";
      if (path.includes("/auth/register")) return "register";
      return "login";
    },
    set: (value: TabType) => {
      router.push(`/auth/${value}`);
    },
  });
</script>

<template>
  <div class="auth-layout">
    <Tabs :value="currentTab" @update:value="(val) => (currentTab = val as TabType)">
      <TabList>
        <Tab v-for="tab in tabs" :key="tab" :value="tab">
          <NuxtLink :to="`/auth/${tab}`" class="tab__link">
            {{ tab.toUpperCase() }}
          </NuxtLink>
        </Tab>
      </TabList>
    </Tabs>
    <slot />
  </div>
</template>

<style scoped>
  .auth-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: "Inter", "Roboto", "Open Sans", sans-serif;
    padding: 2rem 1rem 0;
  }

  :deep(.p-tablist) {
    font:
      600 14px/17.5px "Roboto",
      sans-serif;
    letter-spacing: 0.4px;
  }

  :deep(.p-tablist-tab-list) {
    height: 50px;
    border: none;
    justify-content: center;
    gap: 2rem;
    width: 100%;
    max-width: 560px;
  }

  :deep(.p-tab) {
    width: 150px;
    border: none;
    color: #2e2e2e;
    border-bottom: 2px #ffffff solid;
    background: transparent;
    padding: 0;
  }

  :deep(.p-tab-active) {
    border-bottom: 2px #c63031 solid;
    color: #c63031;
  }

  :deep(.p-tab:not(.p-tab-active):hover) {
    color: #666;
    border-bottom: 2px #e0e0e0 solid;
  }

  .tab__link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }
</style>
