<script setup lang="ts">
  const { tabs } = defineProps<{ tabs: string[] }>();
</script>

<template>
  <Tabs :value="tabs[0] ? tabs[0] : 'page'">
    <TabList>
      <Tab v-for="tab in tabs" :key="tab" :value="tab">{{ tab.toLocaleUpperCase() }}</Tab>
    </TabList>
    <TabPanels>
      <TabPanel v-for="tab in tabs" :key="tab" :value="tab">
        <ProfileTab v-if="tab === 'profile'" />
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
</style>
