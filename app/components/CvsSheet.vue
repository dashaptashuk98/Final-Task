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
      } else if (page === "users") {
        return navigateTo(`/${page}/${e.data.id}/profile`);
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
    :is-visible="userId && page !== 'users' ? checkRights(userId) : checkRights()"
    @activate-form="emit('activateForm', buttonLabel)"
    @submit-search="(input: string) => (filters.name.value = input)" />
  <DataTable
    v-model:filters="filters"
    :value="sheetData"
    removable-sort
    :paginator="page === 'users'"
    :rows="10"
    :rows-per-page-options="[10, 25, 50]"
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
      :sortable="!!col.header"
      :pt="{ bodyCell: { class: 'p-body-cell' } }">
      <template #sorticon="{ sortOrder }">
        <i v-if="sortOrder === 1" class="pi pi-arrow-up" />
        <i v-else-if="sortOrder === -1" class="pi pi-arrow-down" />
      </template>
      <template v-if="col.field === 'profile.avatar'" #body="{ data }">
        <Avatar
          :label="!data.profile.avatar ? data.email[0].toUpperCase() : null"
          :image="data.profile.avatar ? data.profile.avatar : null"
          shape="circle"
          style="
            width: 40px;
            height: 40px;
            font-size: 20px;
            font-weight: 400;
            color: #ffffff;
            background-color: #bdbdbd;
            display: flex;
          " />
      </template>
    </Column>

    <Column header-style="width: 5rem" :pt="{ bodyCell: { class: 'p-body-cell' } }">
      <template #body="slotProps">
        <Button
          v-if="
            userId && page !== 'users'
              ? checkRights(userId)
              : checkRights(slotProps.data.user ? slotProps.data.user.id : slotProps.data.id)
          "
          :icon="'pi pi-ellipsis-v'"
          rounded
          @click="(e: MouseEvent) => handleOptionPick(e, slotProps.data)" />
        <Button v-else icon="pi pi-chevron-right" rounded @click="handleRowClick(slotProps)" />
      </template>
    </Column>
    <template v-if="page === 'cvs'" #groupfooter="{ data }">
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
    padding: 15px;
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

  :deep(.p-datatable-paginator-bottom) {
    border: 0;
    outline: 0;
  }
  :deep(.p-paginator) {
    padding-top: 10px;
    font: 400 16px/24px "Roboto";
    color: #2e2e2e;
  }

  :deep(.p-paginator-pages) {
    gap: 20px;
  }
  :deep(.p-paginator-last),
  :deep(.p-paginator-first),
  :deep(.p-paginator-previous),
  :deep(.p-paginator-next),
  :deep(.p-paginator-page) {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  :deep(.p-paginator-page.p-paginator-page-selected) {
    background: #00000010;
  }
  :deep(.p-paginator-content) {
    gap: 20px;
  }
  :deep(.p-paginator-rpp-dropdown) {
    outline: 1px #2e2e2e solid;
    border-radius: 12px;
    padding: 5px 10px;
    gap: 15px;
  }
  :deep(.p-paginator-rpp-dropdown > *) {
    font: 400 16px/22px "Roboto";
  }
</style>
