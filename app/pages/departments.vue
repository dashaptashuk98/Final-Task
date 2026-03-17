<template>
  <div>
    <CvsSheet
      :columns="columns"
      :sheet-data="departments"
      :context-menu="contextMenuOptions"
      button-label="Add skill"
      page="skills"
      @activate-form="
        () => {
          visible = true;
          modalType = 'Add';
        }
      " />
  </div>
</template>

<script setup lang="ts">
  import type { MenuData, sheetColumn } from "~/types/types";

  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  const { fetchDepartments, departments } = useUsers();

  await Promise.all([fetchDepartments()]);

  const visible = ref(false);
  const modalType = ref<string>("");

  const columns: sheetColumn[] = [{ field: "name", header: "Name" }];

  const contextMenuOptions = computed<MenuData[]>(() => {
    return [
      { label: "Edit Skill", command: () => {} },
      { label: "Delete Skill", command: () => {} },
    ];
  });
</script>
