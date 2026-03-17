<script setup lang="ts" generic="T extends Record<string, any>">
  import type { MenuData, Nullable, sheetColumn } from "~/types/types";
  import { FilterMatchMode } from "@primevue/core/api";

  const {
    columns,
    sheetData,
    contextMenu,
    page,
    buttonLabel,
    userId = "",
  } = defineProps<{
    columns: sheetColumn[];
    sheetData: Nullable<T[]>;
    contextMenu: MenuData[];
    page: string;
    buttonLabel: string;
    userId?: string;
  }>();
  const emit = defineEmits<{
    (event: "handleSelectedItem", value: T): void;
    (event: "submitSearch" | "activateForm", value: string): void;
  }>();
  const cm = ref();
  const filters = ref({
    name: { value: "", matchMode: FilterMatchMode.STARTS_WITH },
  });

  const handleRowClick = (e: Record<"data", T>) => {
    if (e.data) {
      if (page === "cvs") {
        return navigateTo(`/${page}/${e.data.id}/details`);
      }
    }
  };
  const handleOptionPick = (e: MouseEvent, item: T): void => {
    cm.value.show(e);
    emit("handleSelectedItem", item);
  };
</script>

<template>
  <ContextMenu
    ref="cm"
    :model="contextMenu"
    :pt="{
      root: {
        style: {
          'background-color': '#FFFFFF',
          border: '1px #2E2E2E solid',
          padding: '5px 10px',
          'border-radius': '15px',
        },
      },
      itemLabel: { style: { font: '400 14px/24px Roboto' } },
      item: { style: { padding: '3px' } },
    }" />
  <SheetHeader
    :button-label
    :is-visible="userId ? checkRights(userId) : checkRights()"
    @activate-form="emit('activateForm', buttonLabel)"
    @submit-search="(input: string) => (filters.name.value = input)" />
  <DataTable
    v-model:filters="filters"
    :value="sheetData"
    removable-sort
    row-group-mode="subheader"
    selection-mode="single"
    group-rows-by="description"
    :pt="{ rowGroupFooterCell: { class: 'p-footer-cell' } }"
    @row-select="handleRowClick">
    <Column
      v-for="col in columns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
      sortable
      :pt="{ bodyCell: { class: 'p-body-cell' } }">
      <template #sorticon="{ sortOrder }">
        <i v-if="sortOrder === 1" class="pi pi-arrow-up" />
        <i v-else-if="sortOrder === -1" class="pi pi-arrow-down" />
      </template>
    </Column>

    <Column header-style="width: 5rem" :pt="{ bodyCell: { class: 'p-body-cell' } }">
      <template #body="slotProps">
        <Button
          v-if="userId ? checkRights(userId) : checkRights(slotProps.data.user.id)"
          :icon="'pi pi-ellipsis-v'"
          rounded
          @click="(e: MouseEvent) => handleOptionPick(e, slotProps.data)" />
        <Button v-else icon="pi pi-chevron-right" rounded @click="handleRowClick(slotProps)" />
      </template>
    </Column>
    <template #groupfooter="{ data }">
      <div class="p-footer-cell__content" @click="handleRowClick({ data: data })">
        {{ data.description }}
      </div>
    </template>
  </DataTable>
</template>

<style scoped>
  :deep(.p-datatable-header-cell) {
    font: 500 14px/24px "Roboto";
    letter-spacing: 0.15px;
    padding: 20px;
    color: #2e2e2e;
    border: 0;
  }

  :deep(.p-row-even),
  :deep(.p-row-odd) {
    border-top: 1px #2e2e2e solid;
  }

  :deep(.p-body-cell) {
    font: 400 14px/20px "Roboto";
    letter-spacing: 0.15px;
    color: #2e2e2e;
    padding: 20px;
    outline: 0;
    border: 0;
    border-top: 1px #e0e0e0 solid;
  }

  :deep(.p-footer-cell) {
    border: 0;
  }

  .p-footer-cell__content {
    font: 400 14px/24px "Roboto";
    letter-spacing: 0.15px;
    color: #2e2e2e;
    opacity: 0.5;
    padding: 0 20px 20px 20px;
    cursor: pointer;
  }

  .pi-arrow-up,
  .pi-arrow-down {
    padding-left: 5px;
  }

  .p-button:not(:disabled) {
    padding: 5px;
    width: 30px;
    height: 30px;
  }

  .p-button:not(:disabled):hover {
    background-color: #00000015;
  }

  .p-button:not(:disabled):active {
    background-color: #00000030;
  }
</style>
