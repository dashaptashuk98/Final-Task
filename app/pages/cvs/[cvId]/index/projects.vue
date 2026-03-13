<script setup lang="ts">
  import type { InputType } from "~/types/types";
  import type { CvProject } from "~/types/cvs";
  import { addProject, deleteProject } from "~/graphQL/cvs/project.query";

  type ProjectFormKey =
    | "skill"
    | "mastery"
    | "start"
    | "end"
    | "description"
    | "environment"
    | "responsibilities";

  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  const route = useRoute();
  const cvId = route.params.cvId as string;
  const visibleUpdate = ref(false);
  const addedProjects = ref<CvProject[]>([]);
  const deleteMode = ref(false);
  const selectedProjectsToDelete = ref<Set<string>>(new Set());

  const { projects, fetchProject, cv, fetchCv } = useCvs();
  const { clients } = useApollo();

  await fetchProject();
  await fetchCv(cvId);

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
      disabled: true,
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
      disabled: true,
    },
  });

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

  const handleSave = async () => {
    const selectedProject = projects.value.find((p) => p.name === formData.skill.value);
    if (!selectedProject || !clients) {
      return;
    }

    const projectInput = {
      cvId,
      projectId: selectedProject.id,
      start_date: (formData.start.value as Date).toISOString().split("T")[0],
      end_date: formData.end.value
        ? (formData.end.value as Date).toISOString().split("T")[0]
        : null,
      roles: [],
      responsibilities: formData.responsibilities.value
        ? [formData.responsibilities.value as string]
        : [],
    };

    try {
      const result = await clients.default.mutate({
        mutation: addProject,
        variables: { project: projectInput },
      });
      if (result.data?.addCvProject) {
        cv.value = result.data.addCvProject;
        addedProjects.value = result.data.addCvProject.projects || [];
      }
      visibleUpdate.value = false;
    } catch {
      // Handle error silently
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
    deleteMode.value = false;
    selectedProjectsToDelete.value.clear();
  };

  const handleDeleteProjects = async () => {
    try {
      if (!clients || selectedProjectsToDelete.value.size === 0) return;

      for (const cvProjectId of selectedProjectsToDelete.value) {
        const cvProject = addedProjects.value.find((p) => p.id === cvProjectId);
        if (!cvProject) continue;

        const result = await clients.default.mutate({
          mutation: deleteProject,
          variables: {
            cvId,
            projectId: cvProject.project?.id || cvProject.id,
          },
        });

        if (result?.data?.removeCvProject) {
          cv.value = result.data.removeCvProject;
          addedProjects.value = result.data.removeCvProject.projects || [];
        }
      }

      cancelDeleteMode();
    } catch {
      // Handle error silently
    }
  };

  watch(
    () => formData.skill.value,
    (newProjectName) => {
      if (newProjectName) {
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
        @click="deleteMode && toggleProjectForDeletion(cvProject.id)">
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
    <div class="actions__wrapper">
      <Button v-if="!deleteMode" label="Add Project" @click="visibleUpdate = true" />

      <Button
        v-if="!deleteMode && addedProjects.length > 0"
        label="Remove Projects"
        severity="danger"
        @click="deleteMode = true" />

      <Button v-if="deleteMode" label="Cancel" severity="secondary" @click="cancelDeleteMode" />

      <Button
        v-if="deleteMode && selectedProjectsToDelete.size > 0"
        :label="`Delete (${selectedProjectsToDelete.size})`"
        severity="danger"
        @click="handleDeleteProjects" />
    </div>

    <ModalDialog v-model:visible="visibleUpdate" header="Add skill" width="900px">
      <ProjectForm :data="formData" @save="handleSave" @cancel="visibleUpdate = false" />
    </ModalDialog>
  </div>
</template>
