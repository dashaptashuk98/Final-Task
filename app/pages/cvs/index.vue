<script setup lang="ts">
  import type { Cv } from "~/types/cvs";
  import type { MenuData, Nullable, sheetColumn } from "~/types/types";

  definePageMeta({
    middleware: "auth",
  });

  const { fetchCvs, updateCv, deleteCv } = useCvs();
  const cvsList = useState<Nullable<Cv[]>>(() => null);
  const isModalVisible = ref<boolean>(false);
  const modalHeader = ref<string>("");
  cvsList.value = await fetchCvs();
  const selectedCv = ref<Nullable<Cv>>(null);
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

  const activateModal = (header: string, cvData?: Nullable<Cv>): void => {
    modalHeader.value = header;
    isModalVisible.value = true;
    if (cvData) {
      formData.value.name = cvData.name;
      formData.value.education = cvData.education;
      formData.value.description = cvData.description;
    }
  };

  const updateUserCv = async (
    changedData: Pick<Cv, "name" | "education" | "description">,
    id: string,
  ): Promise<void> => {
    if (changedData) {
      await updateCv(Object.assign({ cvId: id }, changedData));
    }
    if (cvsList.value) {
      const index = cvsList.value.findIndex((item) => item.id === id);
      if (index !== -1 && cvsList.value[index]) {
        cvsList.value = cvsList.value.map((cv, i) =>
          i === index ? { ...cv, ...changedData } : cv,
        );
      }
    }
    isModalVisible.value = false;
    return;
  };

  const deleteUserCv = async (): Promise<void> => {
    if (selectedCv.value) {
      const cvId = selectedCv.value.id;
      await deleteCv({ cvId: Number(cvId) });
      if (cvsList.value) {
        cvsList.value = cvsList.value.filter((item) => item.id !== cvId);
      }
      isModalVisible.value = false;
    }
  };

  const contextMenuOptions = ref<MenuData[]>([
    {
      label: "Update CV",
      command: () => activateModal("Update CV", selectedCv.value),
    },
    {
      label: "Remove CV",
      command: () => deleteUserCv(),
    },
  ]);
</script>

<template>
  <section>
    <HeaderComponent />
    <CvsSheet
      :columns
      :sheet-data="cvsList"
      :context-menu="contextMenuOptions"
      page="cvs"
      @handle-selected-item="(cv) => (selectedCv = cv)" />
    <ModalDialog v-model:visible="isModalVisible" :header="modalHeader">
      <CvForm
        :data="formData"
        :user-id="selectedCv && selectedCv.user ? selectedCv.user.id : null"
        :cv-id="selectedCv?.id as string"
        @update-cv="updateUserCv" />
    </ModalDialog>
  </section>
</template>
