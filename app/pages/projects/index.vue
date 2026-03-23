<template>
  <div>
    <CvsSheet
      :columns="columns"
      :sheet-data="sheetData"
      :context-menu="contextMenuOptions"
      button-label="Create project"
      page="projects"
      @handle-selected-item="(project) => (selectedRow = project)"
      @activate-form="
        (header) => activateModal<Record<ProjectFormKey, InputType>>(header, formData)
      " />
    <ModalDialog v-model:visible="isModalVisible" :header="modalHeader" width="900px">
      <ProjectForm :data="formData" @cancel="() => (isModalVisible = false)" @save="submitForm" />
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
  import type {
    CreateProjectInput,
    DeleteProjectInput,
    Project,
    UpdateProjectInput,
  } from "~/types/projects";
  import type { Skill } from "~/types/skills";
  import type { InputType, MenuData, Nullable, ProjectFormKey, sheetColumn } from "~/types/types";
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
  } = useDataTable<Project>();
  const { fetchProject, updateProject, deleteProject, createProject } = useCvs();
  const { fetchSkills } = useUsers();

  const skills = useState<Nullable<Skill[]>>(() => null);
  skills.value = await fetchSkills();
  const skillsList = ref<string[]>([]);
  if (skills.value) {
    skillsList.value = skills.value.map((item) => item.name);
  }
  await callOnce(() => fetchProject());
  sheetData.value =
    (await fetchProject())?.map((p) => ({
      ...p,
      end_date: p.end_date ?? "Till now",
    })) ?? null;

  const columns: sheetColumn[] = [
    { field: "name", header: "Name" },
    { field: "internal_name", header: "Internal Name" },
    { field: "domain", header: "Domain" },
    { field: "start_date", header: "Start Date" },
    { field: "end_date", header: "End Date" },
  ];
  const formData = computed<Record<ProjectFormKey, InputType>>(() => ({
    name: {
      key: "project",
      label: "Project",
      value: selectedRow.value ? selectedRow.value.name : " ",
      type: "Select",
      values: sheetData.value ? sheetData.value.map((item) => item.name) : [],
    },
    domain: {
      key: "domain",
      label: "Domain",
      value: selectedRow.value ? selectedRow.value.domain : "",
      type: "InputText",
    },
    start: {
      key: "start date",
      label: "Start date",
      value: selectedRow.value ? selectedRow.value.start_date : "2026-01-01",
      type: "DatePicker",
    },
    end: {
      key: "end date",
      label: "End date",
      value: selectedRow.value ? (selectedRow.value.end_date as string) : "2026-12-31",
      type: "DatePicker",
    },
    description: {
      key: "description",
      label: "Description",
      value: selectedRow.value ? selectedRow.value.description : "",
      type: "Textarea",
    },
    environment: {
      key: "environment",
      label: "Environment",
      value: selectedRow.value ? selectedRow.value.environment : [],
      type: "MultiSelect",
      values: selectedRow.value ? selectedRow.value.environment : skillsList.value,
    },
  }));

  const submitForm = async (data: Record<ProjectFormKey, InputType>): Promise<void> => {
    if (modalHeader.value === "Update project") {
      const variables = Object.assign(formMapper(data), {
        projectId: Number(selectedRow.value?.id),
      });
      await updateSheetItem<UpdateProjectInput>(variables, updateProject);
    }
    if (modalHeader.value === "Create project") {
      await updateSheetItem<CreateProjectInput>(formMapper(data), createProject);
    }
    await handleMutateConfirmation(fetchProject);
  };

  const handleProjectDelete = async (): Promise<void> => {
    if (selectedRow.value) {
      const id: DeleteProjectInput = { projectId: Number(selectedRow.value.id) };
      await deleteSheetItem<DeleteProjectInput, Promise<void>>(deleteProject, fetchProject, id);
    }
  };

  const formMapper = (data: Record<ProjectFormKey, InputType>): CreateProjectInput => {
    const mappedData: CreateProjectInput = {
      name: data.name.value as string,
      domain: data.domain.value as string,
      start_date: data.start.value as string,
      end_date: (data.end.value as string) ?? "2027-01-01",
      description: data.description.value as string,
      environment: data.environment.value as string[],
    };
    return mappedData;
  };

  const contextMenuOptions = ref<MenuData[]>([
    {
      label: "Update Project",
      command: () => activateModal("Update project", selectedRow.value as object),
    },
    { label: "Delete Project", command: () => handleProjectDelete() },
  ]);
</script>
