<script setup lang="ts">
  import type { Cv } from "~/types/cvs";
  import type { MenuData, Nullable, sheetColumn } from "~/types/types";

  definePageMeta({
    middleware: "auth",
  });

  const { fetchCvs, createCv, updateCv, deleteCv } = useCvs();
  const { authId } = useAuth();
  const cvsList = useState<Nullable<Cv[]>>(() => null);
  const isModalVisible = ref<boolean>(false);
  const modalHeader = ref<string>("");
  const isDeleteModalVisible = ref(false);
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
    } else {
      formData.value.name = "";
      formData.value.education = "";
      formData.value.description = "";
    }
  };

  const handleFormConfirmation = async (): Promise<void> => {
    if (cvsList.value) {
      cvsList.value = await fetchCvs();
    }
    isModalVisible.value = false;
    selectedCv.value = null;
  };

  const submitForm = (
    id: string = String(authId.value),
    data: Pick<Cv, "name" | "education" | "description">,
  ): void => {
    if (modalHeader.value === "Update CV") {
      updateUserCv(data, selectedCv.value?.id || "");
    }
    if (modalHeader.value === "Create CV") {
      createUserCv(data, id);
    }
    handleFormConfirmation();
  };

  const createUserCv = async (
    changedData: Pick<Cv, "name" | "education" | "description">,
    id: string,
  ): Promise<void> => {
    if (changedData) {
      await createCv(Object.assign({ userId: id }, changedData));
    }
  };

  const updateUserCv = async (
    changedData: Pick<Cv, "name" | "education" | "description">,
    id: string,
  ): Promise<void> => {
    if (changedData) {
      await updateCv(Object.assign({ cvId: id }, changedData));
    }
  };

  const deleteUserCv = async (): Promise<void> => {
    if (selectedCv.value) {
      const cvId = Number(selectedCv.value.id);
      await deleteCv({ cvId });
    }
    isDeleteModalVisible.value = false;
    selectedCv.value = null;
    cvsList.value = await fetchCvs();
  };

  const contextMenuOptions = ref<MenuData[]>([
    {
      label: "Update CV",
      command: () => activateModal("Update CV", selectedCv.value),
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
    <HeaderComponent />
    <CvsSheet
      :columns
      :sheet-data="cvsList"
      :context-menu="contextMenuOptions"
      button-label="Create CV"
      page="cvs"
      @handle-selected-item="(cv) => (selectedCv = cv)"
      @activate-form="activateModal" />
    <ModalDialog v-model:visible="isDeleteModalVisible" header="Delete Cv">
      <ActionModal
        :item-name="selectedCv?.name"
        item-type="cv"
        @cancel="isDeleteModalVisible = false"
        @confirm="deleteUserCv" />
    </ModalDialog>
    <ModalDialog v-model:visible="isModalVisible" :header="modalHeader">
      <CvForm
        :data="formData"
        :user-id="selectedCv && selectedCv.user ? selectedCv.user.id : String(authId)"
        :cv-id="selectedCv?.id as string"
        @submit-cv="submitForm" />
    </ModalDialog>
  </section>
</template>
