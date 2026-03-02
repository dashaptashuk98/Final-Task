<script setup lang="ts">
  const { tabs } = defineProps<{ tabs: string[] }>();
  const currentTab = ref<string | number>(tabs[0] ? tabs[0] : "page");
</script>

<template>
  <Tabs :value="currentTab">
    <TabList>
      <Tab v-for="tab in tabs" :key="tab" :value="tab" @click="() => (currentTab = tab)">
        <NuxtLink :to="tab" class="tab__link">
          {{ tab.toLocaleUpperCase() }}
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
