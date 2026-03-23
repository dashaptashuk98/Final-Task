<template>
  <div>
    <CvsSheet
      :columns="columns"
      :sheet-data="sheetData"
      :context-menu="contextMenuOptions"
      button-label="Add department"
      page="department"
      @handle-selected-item="(department) => (selectedRow = department)"
      @activate-form="
        (header) => activateModal<Record<DepartmentFormKey, InputType>>(header, formData)
      " />
    <ModalDialog v-model:visible="isModalVisible" :header="modalHeader">
      <SkillForm :data="formData" @cancel="() => (isModalVisible = false)" @save="submitForm" />
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
  import { useDepartments } from "~/composables/useDepartments";
  import type {
    Department,
    CreateDepartmentInput,
    UpdateDepartmentInput,
    DeleteDepartmentInput,
  } from "~/types/departments";
  import type { InputType, MenuData, DepartmentFormKey, sheetColumn } from "~/types/types";

  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  const {
    isModalVisible,
    modalHeader,
    sheetData,
    selectedRow,
    activateModal,
    updateSheetItem,
    handleMutateConfirmation,
    deleteSheetItem,
  } = useDataTable<Department>();

  const { fetchDepartments, createDepartment, updateDepartment, deleteDepartment } =
    useDepartments();

  await callOnce(async () => {
    sheetData.value = await fetchDepartments();
  });

  const columns: sheetColumn[] = [{ field: "name", header: "Name" }];

  const formData = computed<Record<DepartmentFormKey, InputType>>(() => ({
    name: {
      key: "name",
      label: "Name",
      value: selectedRow.value ? selectedRow.value.name : "",
      type: "InputText",
    },
  }));

  const formMapper = (data: Record<DepartmentFormKey, InputType>): CreateDepartmentInput => ({
    name: data.name.value as string,
  });

  const submitForm = async (data: Record<DepartmentFormKey, InputType>): Promise<void> => {
    if (modalHeader.value === "Update department") {
      const variables = Object.assign(formMapper(data), {
        departmentId: selectedRow.value?.id ?? "",
      });
      await updateSheetItem<UpdateDepartmentInput>(variables, updateDepartment);
    }
    if (modalHeader.value === "Add department") {
      await updateSheetItem<CreateDepartmentInput>(formMapper(data), createDepartment);
    }
    await handleMutateConfirmation(fetchDepartments);
  };

  const handleDepartmentDelete = async (): Promise<void> => {
    if (selectedRow.value) {
      const id: DeleteDepartmentInput = { departmentId: selectedRow.value.id };
      await deleteSheetItem<DeleteDepartmentInput, Promise<void>>(
        deleteDepartment,
        fetchDepartments,
        id,
      );
    }
  };

  const contextMenuOptions = computed<MenuData[]>(() => [
    {
      label: "Edit department",
      command: () => activateModal("Update department", selectedRow.value as object),
    },
    { label: "Delete department", command: () => handleDepartmentDelete() },
  ]);
</script>
