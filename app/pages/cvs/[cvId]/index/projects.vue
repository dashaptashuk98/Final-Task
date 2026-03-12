<script setup lang="ts">
  import type { InputType } from "~/types/types";

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

  const visibleUpdate = ref(false);

  const { projects, fetchProject } = useCvs();

  await fetchProject();

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
    <h3>Projects</h3>
    <Button label="test" @click="visibleUpdate = true"/>
    <ModalDialog v-model:visible="visibleUpdate" header="Add skill" width="900px">
      <ProjectForm :data="formData" />
    </ModalDialog>
  </div>
</template>
