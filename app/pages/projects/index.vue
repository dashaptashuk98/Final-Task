<template>
  <div>
    <CvsSheet
      :columns="columns"
      :sheet-data="projects"
      :context-menu="contextMenuOptions"
      button-label=""
      page="projects"
      @handle-selected-item="() => {}"
      @activate-form="() => {}" />
  </div>
</template>

<script setup lang="ts">
  import type { MenuData, sheetColumn } from "~/types/types";

  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  const { fetchProject, projects } = useCvs();
  const { authUser } = useAuth();

  await callOnce(() => fetchProject());

  const columns: sheetColumn[] = [
    { field: "name", header: "Name" },
    { field: "internal_name", header: "Internal Name" },
    { field: "domain", header: "Domain" },
    { field: "start_date", header: "Start Date" },
    { field: "end_date", header: "End Date" },
  ];

  const contextMenuOptions = computed<MenuData[]>(() => [
    ...(authUser.value?.role === "Admin"
      ? [
          { label: "Edit Project", command: () => {} },
          { label: "Delete Project", command: () => {} },
        ]
      : []),
  ]);
</script>
