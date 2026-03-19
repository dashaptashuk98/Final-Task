<script setup lang="ts">
  import type { Cv } from "~/types/cvs";
  import type { MenuData, sheetColumn } from "~/types/types";

  definePageMeta({
    middleware: "auth",
  });

  const { fetchCvs, createCv, updateCv, deleteCv } = useCvs();
  const {
    isModalVisible,
    isDeleteModalVisible,
    modalHeader,
    activateModal,
    sheetData,
    selectedRow,
    updateSheetItem,
    handleMutateConfirmation,
    deleteSheetItem,
  } = useDataTable();
  const { authId } = useAuth();
  sheetData.value = await fetchCvs();
  const columns = ref<sheetColumn[]>([
    { field: "name", header: "Name" },
    { field: "education", header: "Education" },
    { field: "user.email", header: "Employee" },
    { field: "description", header: "Description" },
  ]);
  const formData = ref<Pick<Cv, "name" | "education" | "description">>({
    name: "",
    education: "",
    description: "",
  });

  const submitForm = async (
    id: string = String(authId.value),
    data: Pick<Cv, "name" | "education" | "description">,
  ): Promise<void> => {
    if (modalHeader.value === "Update CV") {
      const variables = Object.assign(data, { cvId: selectedRow.value?.id });
      updateSheetItem(variables, updateCv);
    }
    if (modalHeader.value === "Create CV") {
      const variables = Object.assign(data, { userId: id });
      updateSheetItem(variables, createCv);
    }
    await handleMutateConfirmation(fetchCvs);
  };

  const deleteUserCv = async (): Promise<void> => {
    if (selectedRow.value) {
      const cvId = { cvId: Number(selectedRow.value.id) };
      await deleteSheetItem(deleteCv, fetchCvs, cvId);
    }
  };

  const contextMenuOptions = ref<MenuData[]>([
    {
      label: "Update CV",
      command: () => activateModal("Update CV", formData.value, selectedRow.value),
    },
    {
      label: "Delete CV",
      command: () => {
        isDeleteModalVisible.value = true;
      },
    },
  ]);
</script>

<template>
  <section>
    <CvsSheet
      :columns
      :user-id="String(authId)"
      :sheet-data="sheetData"
      :context-menu="contextMenuOptions"
      button-label="Create CV"
      page="cvs"
      @handle-selected-item="(cv) => (selectedRow = cv)"
      @activate-form="(value) => activateModal(value, formData)" />
    <ModalDialog v-model:visible="isDeleteModalVisible" header="Delete Cv">
      <ActionModal
        :item-name="selectedRow?.name"
        item-type="cv"
        @cancel="isDeleteModalVisible = false"
        @confirm="deleteUserCv" />
    </ModalDialog>
    <ModalDialog v-model:visible="isModalVisible" :header="modalHeader">
      <CvForm
        :data="formData"
        :user-id="selectedRow && selectedRow.user ? selectedRow.user.id : String(authId)"
        :cv-id="selectedRow?.id as string"
        @submit-cv="submitForm" />
    </ModalDialog>
  </section>
</template>
