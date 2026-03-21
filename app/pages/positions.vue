<template>
  <div>
    <CvsSheet
      :columns="columns"
      :sheet-data="sheetData"
      :context-menu="contextMenuOptions"
      button-label="Create position"
      page="positions"
      @handle-selected-item="(position) => (selectedRow = position)"
      @activate-form="
        (header) => activateModal<Record<PositionForm, InputType>>(header, formData)
      " />
    <ModalDialog v-model:visible="isModalVisible" :header="modalHeader" width="900px">
      <SkillForm :data="formData" @save="submitForm" @cancel="() => (isModalVisible = false)" />
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
  import type {
    CreatePositionInput,
    DeletePositionInput,
    Position,
    PositionForm,
    UpdatePositionInput,
  } from "~/types/positions";
  import type { InputType, MenuData, sheetColumn } from "~/types/types";

  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  const { fetchPositions, createPosition, updatePosition, deletePosition } = usePositions();
  const {
    isModalVisible,
    modalHeader,
    selectedRow,
    sheetData,
    activateModal,
    updateSheetItem,
    deleteSheetItem,
    handleMutateConfirmation,
  } = useDataTable<Position>();

  const formData = computed<Record<PositionForm, InputType>>(() => ({
    name: {
      key: "position",
      label: "Position",
      value: selectedRow.value ? selectedRow.value.name : " ",
      type: "InputText",
    },
  }));

  const columns: sheetColumn[] = [{ field: "name", header: "Name" }];

  sheetData.value = await fetchPositions();

  const contextMenuOptions = computed<MenuData[]>(() => {
    return [
      {
        label: "Update position",
        command: () => activateModal("Update position", selectedRow.value as object),
      },
      { label: "Delete position", command: () => handleProjectDelete() },
    ];
  });

  const submitForm = async (data: Record<PositionForm, InputType>): Promise<void> => {
    if (modalHeader.value === "Update position") {
      const variables = Object.assign(
        { name: data.name.value },
        {
          positionId: Number(selectedRow.value?.id),
        },
      );
      await updateSheetItem<UpdatePositionInput>(variables, updatePosition);
    }
    if (modalHeader.value === "Create position") {
      await updateSheetItem<CreatePositionInput>(
        { name: data.name.value as string },
        createPosition,
      );
    }
    await handleMutateConfirmation(fetchPositions);
  };

  const handleProjectDelete = async (): Promise<void> => {
    if (selectedRow.value) {
      const id: DeletePositionInput = { positionId: Number(selectedRow.value.id) };
      await deleteSheetItem<DeletePositionInput, Promise<void>>(deletePosition, fetchPositions, id);
    }
  };
</script>
