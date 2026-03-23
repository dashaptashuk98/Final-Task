<template>
  <div>
    <CvsSheet
      :columns="columns"
      :sheet-data="sheetData"
      :context-menu="contextMenuOptions"
      button-label="Add skill"
      page="skills"
      @handle-selected-item="(s: Skill) => (selectedRow = s)"
      @activate-form="
        (header) => activateModal<Record<SkillAdminFormKey, InputType>>(header, formData)
      " />
    <ModalDialog v-model:visible="isModalVisible" :header="modalHeader">
      <SkillForm :data="formData" @cancel="() => (isModalVisible = false)" @save="submitForm" />
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
  import type { Skill, CreateSkillInput, UpdateSkillInput, DeleteSkillInput } from "~/types/skills";
  import type { InputType, MenuData, SkillAdminFormKey, sheetColumn } from "~/types/types";

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
  } = useDataTable<Skill>();

  const {
    fetchSkills,
    fetchSkillCategories,
    skillCategories,
    createSkill,
    updateSkill,
    deleteSkill,
  } = useUsers();

  sheetData.value = await fetchSkills();
  await fetchSkillCategories();

  const columns: sheetColumn[] = [
    { field: "name", header: "Name" },
    { field: "category_name", header: "Category" },
  ];

  const formData = computed<Record<SkillAdminFormKey, InputType>>(() => ({
    name: {
      key: "name",
      label: "Name",
      value: selectedRow.value ? selectedRow.value.name : "",
      type: "InputText",
    },
    category: {
      key: "category",
      label: "Category",
      value: selectedRow.value?.category_name ?? "",
      type: "Select",
      values: skillCategories.value?.map((c) => ({ name: c.name })) ?? [],
    },
  }));

  const formMapper = (data: Record<SkillAdminFormKey, InputType>): CreateSkillInput => ({
    name: data.name.value as string,
    categoryId: skillCategories.value?.find((c) => c.name === data.category.value)?.id ?? null,
  });

  const submitForm = async (data: Record<SkillAdminFormKey, InputType>): Promise<void> => {
    if (modalHeader.value === "Update skill") {
      const variables = Object.assign(formMapper(data), {
        skillId: selectedRow.value?.id ?? "",
      });
      await updateSheetItem<UpdateSkillInput>(variables, updateSkill);
    }
    if (modalHeader.value === "Add skill") {
      await updateSheetItem<CreateSkillInput>(formMapper(data), createSkill);
    }
    await handleMutateConfirmation(fetchSkills);
  };

  const handleSkillDelete = async (): Promise<void> => {
    if (selectedRow.value) {
      const id: DeleteSkillInput = { skillId: selectedRow.value.id };
      await deleteSheetItem<DeleteSkillInput, Promise<void>>(deleteSkill, fetchSkills, id);
    }
  };

  const contextMenuOptions = computed<MenuData[]>(() => [
    {
      label: "Edit Skill",
      command: () => activateModal("Update skill", selectedRow.value as object),
    },
    { label: "Delete Skill", command: () => handleSkillDelete() },
  ]);
</script>
