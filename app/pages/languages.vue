<template>
  <div>
    <CvsSheet
      :columns="columns"
      :sheet-data="sheetData"
      :context-menu="contextMenuOptions"
      button-label="Create language"
      page="languages"
      @handle-selected-item="(language) => (selectedRow = language)"
      @activate-form="
        (header) => activateModal<Record<LanguageForm, InputType>>(header, formData)
      " />
    <ModalDialog v-model:visible="isModalVisible" :header="modalHeader" width="900px">
      <SkillForm
        :data="formData"
        :error-message="isoError"
        @save="submitForm"
        @cancel="() => (isModalVisible = false)" />
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
  import type { InputType, MenuData, sheetColumn } from "~/types/types";
  import type {
    createLanguageInput,
    deleteLanguageInput,
    Language,
    LanguageForm,
    updateLanguageInput,
  } from "~/types/languages";

  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  const { fetchLanguages, createLanguage, updateLanguage, deleteLanguage } = useLanguages();
  const {
    isModalVisible,
    modalHeader,
    selectedRow,
    sheetData,
    activateModal,
    updateSheetItem,
    deleteSheetItem,
    handleMutateConfirmation,
  } = useDataTable<Language>();
  const isoError = ref<string>("");
  sheetData.value = await fetchLanguages();

  const columns: sheetColumn[] = [
    { field: "name", header: "Name" },
    { field: "native_name", header: "Native Name" },
    { field: "iso2", header: "ISO" },
  ];
  const formData = computed<Record<LanguageForm, InputType>>(() => ({
    name: {
      key: "language",
      label: "Language",
      value: selectedRow.value ? selectedRow.value.name : "",
      type: "InputText",
    },
    native_name: {
      key: "native_name",
      label: "Native name",
      value: selectedRow.value ? selectedRow.value.native_name : "",
      type: "InputText",
    },
    iso2: {
      key: "iso2",
      label: "ISO2",
      value: selectedRow.value ? selectedRow.value.iso2 : "",
      type: "InputText",
    },
  }));

  const contextMenuOptions = computed<MenuData[]>(() => {
    return [
      {
        label: "Update language",
        command: () => activateModal("Update language", selectedRow.value as object),
      },
      { label: "Delete language", command: () => handleLanguageDelete() },
    ];
  });

  const formMapper = (data: Record<LanguageForm, InputType>): createLanguageInput => {
    const variables: createLanguageInput = {
      name: "",
      iso2: "",
      native_name: "",
    };
    if (!data) {
      return variables;
    }
    Object.keys(data).forEach(
      (key) =>
        (variables[key as keyof createLanguageInput] = data[
          key as keyof Record<LanguageForm, InputType>
        ].value as string),
    );
    return variables;
  };

  const submitForm = async (data: Record<LanguageForm, InputType>): Promise<void> => {
    isoError.value = "";
    if ((data.iso2.value as string).length !== 2) {
      isoError.value = "ISO2 must be exactly 2 characters";
      return;
    }
    if (modalHeader.value === "Update language") {
      const variables = Object.assign(formMapper(data), {
        languageId: Number(selectedRow.value?.id),
      });
      await updateSheetItem<updateLanguageInput>(variables, updateLanguage);
    }
    if (modalHeader.value === "Create language") {
      await updateSheetItem<createLanguageInput>(formMapper(data), createLanguage);
    }
    await handleMutateConfirmation(fetchLanguages);
  };

  const handleLanguageDelete = async (): Promise<void> => {
    if (selectedRow.value) {
      const id: deleteLanguageInput = { languageId: Number(selectedRow.value.id) };
      await deleteSheetItem<deleteLanguageInput, Promise<void>>(deleteLanguage, fetchLanguages, id);
    }
  };
</script>
