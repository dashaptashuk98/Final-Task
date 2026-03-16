<script setup lang="ts">
  import type { InputType, ProjectFormKey, MenuData, sheetColumn } from "~/types/types";
  import type { CvProject, AddCvProjectInput, UpdateCvProjectInput } from "~/types/cvs";
  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  const route = useRoute();
  const cvId = route.params.cvId as string;

  const addedProjects = useState<CvProject[]>("addedProjects", () => []);
  const isModalVisible = ref(false);
  const modalType = ref("");
  const selectedCvProject = ref<CvProject | null>(null);
  const isEditMode = ref(false);
  const {
    projects,
    fetchProject,
    cv,
    fetchCv,
    addCvProject,
    updateCvProjectData,
    deleteCvProject,
  } = useCvs();

  await fetchProject();
  await fetchCv(cvId);

  if (cv.value?.user?.id) {
    route.params.userID = cv.value.user.id;
  }

  if (cv.value?.projects) {
    addedProjects.value = cv.value.projects;
  }

  const projectOptions = computed(() => projects.value.map((project) => project.name));

  const formData = reactive<Record<ProjectFormKey, InputType>>({
    skill: {
      key: "project",
      label: "Project",
      value: "",
      type: "Select",
      values: projectOptions.value,
    },
    mastery: {
      key: "domain",
      label: "Domain",
      value: "",
      type: "InputText",
      values: [],
    },
    start: {
      key: "start date",
      label: "Start date",
      value: "",
      type: "DatePicker",
      values: [],
    },
    end: {
      key: "end date",
      label: "End date",
      value: "",
      type: "DatePicker",
      values: [],
    },
    description: {
      key: "description",
      label: "Description",
      value: "",
      type: "Textarea",
      values: [],
    },
    environment: {
      key: "environment",
      label: "Environment",
      value: [],
      type: "MultiSelect",
      values: [],
    },
    responsibilities: {
      key: "responsibilities",
      label: "Responsibilities",
      value: "",
      type: "InputText",
      values: [],
    },
  });

  const fillProjectDataForEdit = (cvProject: CvProject) => {
    formData.skill.value = (cvProject.project?.name || cvProject.name) ?? "";
    formData.mastery.value = (cvProject.project?.domain || cvProject.domain) ?? "";
    formData.start.value = new Date(cvProject.project?.start_date || cvProject.start_date);
    const endDate = cvProject.project?.end_date || cvProject.end_date;
    formData.end.value = endDate ? new Date(endDate) : "";
    formData.description.value = cvProject.project?.description || cvProject.description;
    formData.environment.value = cvProject.project?.environment || cvProject.environment || [];
    formData.environment.values = cvProject.project?.environment || cvProject.environment || [];
    formData.responsibilities.value = cvProject.responsibilities?.join(", ") || "";
  };

  const fillProjectData = (projectName: string) => {
    const selectedProject = projects.value.find((p) => p.name === projectName);
    if (selectedProject) {
      formData.mastery.value = selectedProject.domain;
      formData.start.value = new Date(selectedProject.start_date);
      formData.end.value = selectedProject.end_date ? new Date(selectedProject.end_date) : "";
      formData.description.value = selectedProject.description;
      formData.environment.value = selectedProject.environment;
      formData.environment.values = selectedProject.environment;
      formData.responsibilities.value = "";
    }
  };

  const resetForm = () => {
    formData.skill.value = "";
    formData.mastery.value = "";
    formData.start.value = "";
    formData.end.value = "";
    formData.description.value = "";
    formData.environment.value = [];
    formData.responsibilities.value = "";
    selectedCvProject.value = null;
    isEditMode.value = false;
  };

  const handleSave = async () => {
    if (isEditMode.value && selectedCvProject.value) {
      await handleProjectUpdate();
    } else {
      await handleProjectAdd();
    }
  };

  const handleProjectAdd = async () => {
    const selectedProject = projects.value.find((p) => p.name === formData.skill.value);
    if (!selectedProject) {
      return;
    }

    if (!formData.start.value) {
      return;
    }

    const startDate = formData.start.value;
    const projectInput: AddCvProjectInput = {
      cvId,
      projectId: selectedProject.id as string,
      start_date: (startDate as Date).toISOString().split("T")[0] as string,
      end_date: formData.end.value
        ? (formData.end.value as Date).toISOString().split("T")[0]
        : null,
      roles: [],
      responsibilities: formData.responsibilities.value
        ? [formData.responsibilities.value as string]
        : [],
    };

    const result = await addCvProject(projectInput);
    if (result) {
      addedProjects.value = [...(result.projects || [])];
      isModalVisible.value = false;
      resetForm();
    }
  };

  const handleProjectUpdate = async () => {
    if (!selectedCvProject.value) return;
    if (!formData.start.value) {
      return;
    }

    const projectId = selectedCvProject.value.project?.id || selectedCvProject.value.id;
    if (!projectId) {
      return;
    }

    const projectInput: UpdateCvProjectInput = {
      cvId,
      projectId,
      start_date: (formData.start.value as Date).toISOString().split("T")[0] as string,
      end_date: formData.end.value
        ? (formData.end.value as Date).toISOString().split("T")[0]
        : null,
      roles: selectedCvProject.value.roles || [],
      responsibilities: formData.responsibilities.value
        ? [formData.responsibilities.value as string]
        : [],
    };

    const result = await updateCvProjectData(projectInput);
    if (result) {
      addedProjects.value = [...(result.projects || [])];
      isModalVisible.value = false;
      resetForm();
    }
  };

  const activateModal = (title: string, cvProject?: CvProject) => {
    if (cvProject) {
      selectedCvProject.value = cvProject;
      isEditMode.value = true;
      fillProjectDataForEdit(cvProject);
    } else {
      resetForm();
      isEditMode.value = false;
    }
    isModalVisible.value = true;
    modalType.value = title;

    return title;
  };

  watch(
    () => formData.skill.value,
    (newProjectName) => {
      if (newProjectName && !isEditMode.value) {
        fillProjectData(newProjectName as string);
      }
    },
  );

  watch(projects, () => {
    formData.skill.values = projectOptions.value;
  });

  const columns: sheetColumn[] = [
    { field: "project.name", header: "Name" },
    { field: "project.domain", header: "Domain" },
    { field: "project.start_date", header: "Start Date" },
    { field: "project.end_date", header: "End Date" },
  ];

  const isDeleteModalVisible = ref(false);

  const handleConfirmDelete = async () => {
    if (!selectedCvProject.value) return;
    const projectId = selectedCvProject.value.project?.id || selectedCvProject.value.id;
    const result = await deleteCvProject(cvId, projectId);
    if (result) {
      addedProjects.value = [...(result.projects || [])];
      isDeleteModalVisible.value = false;
      selectedCvProject.value = null;
    }
  };

  const { authUser } = useAuth();

  const contextMenuOptions = computed<MenuData[]>(() => [
    ...(authUser.value?.role === "Admin"
      ? [
          {
            label: "Edit Project",
            command: () =>
              selectedCvProject.value && activateModal("Edit", selectedCvProject.value),
          },
        ]
      : []),
    {
      label: "Delete Project",
      command: () => {
        isDeleteModalVisible.value = true;
      },
    },
  ]);
</script>

<template>
  <div>
    <CvsSheet
      :columns="columns"
      :sheet-data="addedProjects"
      :context-menu="contextMenuOptions"
      :button-label="checkRights(cv?.user?.id || '') ? 'Add Project' : ''"
      page="projects"
      @handle-selected-item="(p: CvProject) => (selectedCvProject = p)"
      @activate-form="() => checkRights(cv?.user?.id || '') && activateModal('Add')" />

    <ModalDialog
      v-if="checkRights(cv?.user?.id || '') || authUser?.role === 'Admin'"
      v-model:visible="isDeleteModalVisible"
      header="Delete Project">
      <ActionModal
        :item-name="selectedCvProject?.project?.name || selectedCvProject?.name"
        item-type="project"
        @cancel="isDeleteModalVisible = false"
        @confirm="handleConfirmDelete" />
    </ModalDialog>

    <ModalDialog
      :visible="isModalVisible"
      :header="`${modalType} Project`"
      width="900px"
      @update:visible="isModalVisible = $event"
      @hide="resetForm">
      <ProjectForm
        :data="formData"
        :action="modalType"
        @save="handleSave"
        @cancel="isModalVisible = false" />
    </ModalDialog>
  </div>
</template>

<style scoped>
  .selected-for-delete {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    cursor: pointer;
  }

  .actions__wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    margin-top: 2rem;
  }

  .btn-add :deep(.p-button) {
    background: transparent;
    border: 1px solid #767676;
    color: #767676;
    padding: 0.5rem 1rem;
  }

  .btn-add :deep(.p-button-label) {
    color: #767676;
    text-transform: uppercase;
    font-weight: 500;
  }

  .btn-remove :deep(.p-button) {
    background: transparent;
    border: 1px solid #c63031;
    color: #c63031;
    padding: 0.5rem 1rem;
  }

  .btn-remove :deep(.p-button-label) {
    color: #c63031 !important;
    text-transform: uppercase;
    font-weight: 500;
  }
</style>
