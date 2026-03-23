<script setup lang="ts">
  import type { Tabs } from "~/types/types";

  const { tabs, centered = false } = defineProps<{
    tabs: Tabs[];
    centered?: boolean;
  }>();

  const route = useRoute();

  const currentTab = computed(() => {
    const activeTab = tabs.find((tab) => route.path === tab.to);
    return activeTab?.label || tabs[0]?.label || "page";
  });
</script>

<template>
  <Tabs :value="currentTab" :class="{ centered }">
    <TabList>
      <Tab v-for="tab in tabs" :key="tab.label" :value="tab.label">
        <NuxtLink :to="tab.to" class="tab__link">
          {{ tab.label.toLocaleUpperCase() }}
        </NuxtLink>
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel :value="currentTab">
        <slot />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<style scoped>
  :deep(.p-tablist) {
    font:
      600 14px/17.5px "Roboto",
      sans-serif;
    letter-spacing: 0.4px;
  }

  :deep(.p-tablist-tab-list) {
    height: 50px;
    border: none;
  }
  :deep(.p-tab) {
    width: 150px;
    border: none;
    color: #2e2e2e;
    border-bottom: 2px #ffffff solid;
  }
  .centered :deep(.p-tablist-tab-list) {
    justify-content: center;
  }

  :deep(.p-tab-active) {
    border-bottom: 2px #c63031 solid;
    color: #c63031;
  }

  .tab__link {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-decoration: none;
    color: #2e2e2e;
  }
</style>
