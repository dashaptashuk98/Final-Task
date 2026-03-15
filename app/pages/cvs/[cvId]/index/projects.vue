<script setup lang="ts">
  import type { InputType, ProjectFormKey } from "~/types/types";
  import type { CvProject, AddCvProjectInput, UpdateCvProjectInput } from "~/types/cvs";
  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  const route = useRoute();
  const cvId = route.params.cvId as string;

  const addedProjects = ref<CvProject[]>([]);
  const isSelectMode = ref(false);
  const isModalVisible = ref(false);
  const modalType = ref("");
  const selectedCvProject = ref<CvProject | null>(null);
  const isEditMode = ref(false);
  // const showDeleteModal = ref(false);
  // const projectToDelete = ref<CvProject | null>(null);
  const selectedProjectsToDelete = ref<Set<string>>(new Set());
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

  // Set userID in route params for checkRights
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
      disabled: true,
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
      disabled: true,
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
      addedProjects.value = result.projects || [];
      isModalVisible.value = false;
      resetForm();
    }
  };

  const toggleProjectForDeletion = (projectId: string) => {
    if (selectedProjectsToDelete.value.has(projectId)) {
      selectedProjectsToDelete.value.delete(projectId);
    } else {
      selectedProjectsToDelete.value.add(projectId);
    }
  };

  const cancelDeleteMode = () => {
    isSelectMode.value = false;
    selectedProjectsToDelete.value.clear();
  };

  const handleProjectClick = (cvProject: CvProject) => {
    if (isSelectMode.value) {
      toggleProjectForDeletion(cvProject.id);
      return;
    }
    activateModal("Edit", cvProject);
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
      addedProjects.value = result.projects || [];
      isModalVisible.value = false;
      resetForm();
    }
  };

  // const openDeleteModal = (cvProject: CvProject) => {
  //   projectToDelete.value = cvProject;
  //   showDeleteModal.value = true;
  // };

  // const handleConfirmDelete = async () => {
  //   if (!projectToDelete.value) return;

  //   const projectId = projectToDelete.value.project?.id || projectToDelete.value.id;
  //   if (!projectId) {
  //     console.error("Project ID is missing");
  //     return;
  //   }

  //   const result = await deleteCvProject(cvId, projectId);

  //   if (result) {
  //     addedProjects.value = result.projects || [];
  //   }

  //   showDeleteModal.value = false;
  //   projectToDelete.value = null;
  // };

  const handleActivateModal = (title: string) => {
    activateModal(title);
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

  const handleToggleMode = () => {
    if (isSelectMode.value) {
      cancelDeleteMode();
    } else {
      isSelectMode.value = true;
    }
  };

  const handleDeleteProjects = async () => {
    if (selectedProjectsToDelete.value.size === 0) return;

    for (const cvProjectId of selectedProjectsToDelete.value) {
      const cvProject = addedProjects.value.find((p) => p.id === cvProjectId);
      if (!cvProject) continue;

      const projectId = cvProject.project?.id || cvProject.id;
      if (!projectId) {
        continue;
      }

      const result = await deleteCvProject(cvId, projectId);

      if (result) {
        addedProjects.value = result.projects || [];
      }
    }

    cancelDeleteMode();
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
</script>

<template>
  <div>
    <div v-if="addedProjects.length">
      <div
        v-for="cvProject in addedProjects"
        :key="cvProject.id"
        :class="{ 'selected-for-delete': selectedProjectsToDelete.has(cvProject.id) }"
        @click="handleProjectClick(cvProject)">
        <h4>{{ cvProject.project?.name || cvProject.name }}</h4>
        <p><strong>Domain:</strong> {{ cvProject.project?.domain || cvProject.domain }}</p>
        <p>
          <strong>Start Date:</strong> {{ cvProject.project?.start_date || cvProject.start_date }}
        </p>
        <p>
          <strong>End Date:</strong>
          {{ cvProject.project?.end_date || cvProject.end_date || "N/A" }}
        </p>
        <p>
          <strong>Description:</strong>
          {{ cvProject.project?.description || cvProject.description }}
        </p>
        <p>
          <strong>Environment:</strong>
          {{ cvProject.project?.environment?.join(", ") || cvProject.environment?.join(", ") }}
        </p>
        <p>
          <strong>Responsibilities:</strong> {{ cvProject.responsibilities?.join(", ") || "N/A" }}
        </p>
        <p><strong>Roles:</strong> {{ cvProject.roles?.join(", ") || "N/A" }}</p>
      </div>
    </div>
    <div v-else>
      <p>No projects found</p>
    </div>
    <!-- <ActionModal
      width="400px"
      header="Delete Project"
      :visible="showDeleteModal"
      :item-name="projectToDelete?.project?.name || projectToDelete?.name || ''"
      item-type="project"
      @update:visible="showDeleteModal = $event"
      @cancel="showDeleteModal = false"
      @confirm="handleConfirmDelete"
    /> -->

    <AddRemoveButtons
      :is-select-mode="isSelectMode"
      :select-counter="selectedProjectsToDelete.size"
      page-title="project"
      @activate-modal="handleActivateModal"
      @toggle-mode="handleToggleMode"
      @handle-remove="handleDeleteProjects" />

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
