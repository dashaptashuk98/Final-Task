<script setup lang="ts">
  import type { Cv } from "~/types/cvs";
  import type { MenuData, Nullable, sheetColumn } from "~/types/types";

  const { columns, sheetData, contextMenu, page } = defineProps<{
    columns: sheetColumn[];
    sheetData: Nullable<Cv[]>;
    contextMenu: MenuData[];
    page: string;
  }>();
  const emit = defineEmits<{ (event: "handleSelectedItem", value: Cv): void }>();
  const cm = ref();
  const handleRowClick = (e: Record<"data", Cv>) => {
    if (e.data) {
      if (page === "cvs") {
        return navigateTo(`/${page}/${e.data.id}/details`);
      }
    }
  };
  const handleOptionPick = (e: MouseEvent, cv: Cv): void => {
    cm.value.show(e);
    emit("handleSelectedItem", cv);
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
  <DataTable
    :value="sheetData"
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
      :pt="{ bodyCell: { class: 'p-body-cell' } }" />
    <Column header-style="width: 5rem" :pt="{ bodyCell: { class: 'p-body-cell' } }">
      <template #body="{ data }">
        <Button
          :icon="'pi pi-ellipsis-v'"
          class="action-button"
          size="large"
          text
          rounded
          severity="secondary"
          @click="(e: MouseEvent) => handleOptionPick(e, data)" />
      </template>
    </Column>
    <template #groupfooter="slotProps">
      <div class="p-footer-cell__content" @click="handleRowClick({ data: slotProps.data })">
        {{ slotProps.data.description }}
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
    opacity: 0.6;
    padding: 0 20px 20px 20px;
    cursor: pointer;
  }
</style>
