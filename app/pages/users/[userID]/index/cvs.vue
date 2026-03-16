<script setup lang="ts">
  import type { Cv } from "~/types/cvs";
  import type { MenuData, Nullable, sheetColumn } from "~/types/types";

  definePageMeta({
    middleware: "auth",
  });

  const { createCv, updateCv, deleteCv } = useCvs();
  const { authId } = useAuth();
  const { user, fetchUser } = useUsers();
  const route = useRoute();
  const cvsList = useState<Nullable<Cv[]>>("cvs", () => null);
  const isModalVisible = ref<boolean>(false);
  const modalHeader = ref<string>("");
  const selectedCv = ref<Nullable<Cv>>(null);
  const columns = ref<sheetColumn[]>([
    { field: "name", header: "Name" },
    { field: "education", header: "Education" },
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
      await updateSheet();
    }
    isModalVisible.value = false;
    selectedCv.value = null;
  };

  const submitForm = (
    id: string = String(authId.value),
    data: Pick<Cv, "name" | "education" | "description">,
  ): void => {
    if (modalHeader.value === "Update CV") {
      updateUserCv(data, id);
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
      const cvId = selectedCv.value.id;
      await deleteCv({ cvId: Number(cvId) });
    }
    handleFormConfirmation();
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

  const updateSheet = async (): Promise<void> => {
    await fetchUser(route.params.userID as string);
    if (user.value && user.value.cvs) {
      cvsList.value = user.value.cvs;
    }
  };

  updateSheet();
</script>

<template>
  <section>
    <CvsSheet
      :columns
      :sheet-data="cvsList"
      :context-menu="contextMenuOptions"
      button-label="Create CV"
      page="cvs"
      @handle-selected-item="(cv) => (selectedCv = cv)"
      @activate-form="activateModal" />
    <ModalDialog v-model:visible="isModalVisible" :header="modalHeader">
      <CvForm
        :data="formData"
        :user-id="selectedCv && selectedCv.user ? selectedCv.user.id : String(authId)"
        :cv-id="selectedCv?.id as string"
        @submit-cv="submitForm" />
    </ModalDialog>
  </section>
</template>
