<template>
  <div class="tabs-container">
    <Tabs :value="currentTab" class="auth-tabs" @update:value="handleTabChange">
      <TabList>
        <Tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
          {{ tab.label }}
        </Tab>
      </TabList>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
  import Tabs from "primevue/tabs";
  import TabList from "primevue/tablist";
  import Tab from "primevue/tab";

  const route = useRoute();
  const router = useRouter();

  const tabs = [
    { label: "ВОЙТИ", value: "login" },
    { label: "СОЗДАТЬ", value: "register" },
  ];

  const currentTab = computed(() => {
    return route.path === "/auth/login" ? "login" : "register";
  });

  const handleTabChange = (value: string | number) => {
    if (value === "login" && route.path !== "/auth/login") {
      router.push("/auth/login");
    } else if (value === "register" && route.path !== "/auth/register") {
      router.push("/auth/register");
    }
  };
</script>

<style scoped>
  .tabs-container {
    width: 100%;
    max-width: 560px;
    margin-bottom: 2rem;
  }

  .auth-tabs {
    width: 100%;
  }

  .auth-tabs :deep(.p-tablist-tab-list) {
    justify-content: center;
  }

  .auth-tabs :deep(.p-tab) {
    font-size: 1rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    color: #999;
    background: transparent;
    border: none;
  }

  .auth-tabs :deep(.p-tab.p-tab-active) {
    color: #2e2e2e;
    font-weight: 600;
    border-bottom: 1px solid #b52b2b;
  }

  .auth-tabs :deep(.p-tablist-nav),
  .auth-tabs :deep(.p-tablist-nav-container),
  .auth-tabs :deep(.p-tablist-tab-list) {
    border: none;
  }
</style>
