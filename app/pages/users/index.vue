<template>
  <div>
    <IconField>
      <InputIcon class="pi pi-search search-icon" />
      <InputText v-model="searchQuery" class="custom-search" />
    </IconField>
    <TableUser />
  </div>
</template>

<script setup>
  import { ref } from "vue";

  const searchQuery = ref("");
  definePageMeta({
    layout: "default",
    middleware: "auth",
  });
</script>

<style scoped>
  .custom-search {
    padding: 8.5px 12px 8.5px 40px !important;
    border-radius: 40px !important;
    width: 100%;
    max-width: 320px;
    border: 1px solid #e0e0e0;
    transition: all 0.2s ease;
  }

  .custom-search:hover {
    border-color: #b0b0b0;
  }

  .custom-search:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    z-index: 1;
  }

  :deep(.p-inputtext) {
    padding: 8.5px 12px 8.5px 40px !important;
    border-radius: 40px !important;
  }

  :deep(.p-inputtext:focus) {
    box-shadow: none;
    border-color: #3498db;
  }

  :deep(.p-iconfield .p-inputicon:first-child) {
    position: absolute;
    left: 14px;
  }

  :deep(.p-inputicon) {
    margin-top: 0;
  }
</style>
