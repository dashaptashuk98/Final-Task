<template>
  <div>
    <CvsSheet
      :columns="columns"
      :sheet-data="languages"
      :context-menu="contextMenuOptions"
      button-label=""
      page="languages"
      @handle-selected-item="(l: Language) => (selectedLanguage = l)"
      @activate-form="() => {}" />
  </div>
</template>

<script setup lang="ts">
  import type { MenuData, sheetColumn } from "~/types/types";
  import type { Language } from "~/types/languages";

  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  const { fetchLanguages } = useUsers();
  const { authUser } = useAuth();

  const languages = useState<Language[]>("languages", () => []);

  await callOnce(async () => {
    const result = await fetchLanguages();
    if (result) languages.value = result;
  });

  const selectedLanguage = ref<Language | null>(null);

  const columns: sheetColumn[] = [
    { field: "name", header: "Name" },
    { field: "native_name", header: "Native Name" },
    { field: "iso2", header: "ISO" },
  ];

  const contextMenuOptions = computed<MenuData[]>(() => [
    ...(authUser.value?.role === "Admin"
      ? [
          { label: "Edit Language", command: () => {} },
          { label: "Delete Language", command: () => {} },
        ]
      : []),
  ]);
</script>
