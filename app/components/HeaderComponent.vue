<template>
  <Breadcrumb
    :home="home"
    :model="breadcrumbItems"
    class="page-breadcrumb"
    :style="{
      background: 'transparent',
      border: 'none',
      padding: '0',
      margin: '0 0 10px 0',
    }">
    <template #separator>
      <span class="separator">/</span>
    </template>
    <template #item="{ item, props }">
      <span v-bind="props.action">
        <span class="breadcrumb-label">{{ item.label }}</span>
      </span>
    </template>
  </Breadcrumb>
</template>

<script setup>
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  const route = useRoute();

  const home = null;

  const breadcrumbItems = computed(() => {
    const path = route.path.replace("/", "");

    if (!path) return [];

    return [
      {
        label: path.charAt(0).toUpperCase() + path.slice(1).toLowerCase(),
        to: route.path,
      },
    ];
  });
</script>

<style scoped>
  .page-breadcrumb {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: block;
  }

  .separator {
    color: rgba(0, 0, 0, 0.6);
    margin: 0 8px;
  }

  .breadcrumb-label {
    color: rgba(0, 0, 0, 0.6);
  }

  :deep(.p-breadcrumb-list) {
    padding: 0 !important;
    margin: 0 !important;
  }

  :deep(.p-breadcrumb-list li) {
    margin: 0 !important;
    padding: 0 !important;
  }

  :deep(.p-breadcrumb-list-item) {
    margin: 0 !important;
    padding: 0 !important;
  }

  :deep(.p-breadcrumb-home) {
    display: none !important;
  }
</style>
