<template>
  <div>
    <div v-if="project" class="project-detail">
      <div class="project-header">
        <h2 class="project-header__title">{{ project.name }}</h2>
        <Button
          :label="'Update project'.toLocaleUpperCase()"
          type="button"
          icon="pi pi-plus"
          @click="() => (isModalVisible = true)" />
      </div>
      <div class="project-detail__body">
        <div v-for="row in rows" :key="row.label" class="project-detail__row">
          <span class="project-detail__label">{{ row.label }}</span>
          <span class="project-detail__value">{{ row.value }}</span>
        </div>
      </div>
    </div>
    <ModalDialog v-model:visible="isModalVisible" header="Update project" width="900px">
      <ProjectForm :data="formData" @cancel="() => (isModalVisible = false)" @save="submitForm" />
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
  import type { CreateProjectInput, Project, UpdateProjectInput } from "~/types/projects";
  import type { Skill } from "~/types/skills";
  import type { InputType, Nullable, ProjectFormKey } from "~/types/types";

  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  const route = useRoute();
  const { fetchProject, updateProject } = useCvs();
  const { isModalVisible, updateSheetItem } = useDataTable();
  const { fetchSkills } = useUsers();
  const projectId = route.params.projectId as string;
  const projects = useState<Nullable<Project[]>>(() => null);
  const project = computed(() =>
    projects.value ? projects.value.find((p) => p.id === projectId) : null,
  );
  const skills = useState<Nullable<Skill[]>>(() => null);
  const skillsList = ref<string[]>([]);

  await callOnce(() => fetchProject());
  projects.value = await fetchProject();
  skills.value = await fetchSkills();
  if (skills.value) {
    skillsList.value = skills.value.map((item) => item.name);
  }

  const rows = computed(() =>
    project.value
      ? [
          { label: "Internal Name", value: project.value.internal_name },
          { label: "Domain", value: project.value.domain },
          { label: "Start Date", value: project.value.start_date },
          { label: "End Date", value: project.value.end_date || "N/A" },
          { label: "Description", value: project.value.description },
          { label: "Environment", value: project.value.environment?.join(", ") },
        ]
      : [],
  );
  const formData = computed<Record<ProjectFormKey, InputType>>(() => ({
    name: {
      key: "project",
      label: "Project",
      value: project.value ? project.value.name : " ",
      type: "Select",
      values: projects.value ? projects.value.map((item) => item.name) : [],
    },
    domain: {
      key: "domain",
      label: "Domain",
      value: project.value ? project.value.domain : "",
      type: "InputText",
    },
    start: {
      key: "start date",
      label: "Start date",
      value: project.value ? project.value.start_date : "2026-01-01",
      type: "DatePicker",
    },
    end: {
      key: "end date",
      label: "End date",
      value: project.value ? (project.value.end_date as string) : "2026-12-31",
      type: "DatePicker",
    },
    description: {
      key: "description",
      label: "Description",
      value: project.value ? project.value.description : "",
      type: "Textarea",
    },
    environment: {
      key: "environment",
      label: "Environment",
      value: project.value ? project.value.environment : [],
      type: "MultiSelect",
      values: project.value ? project.value.environment : skillsList.value,
    },
  }));

  const submitForm = async (data: Record<ProjectFormKey, InputType>): Promise<void> => {
    const variables = Object.assign(formMapper(data), { projectId: Number(project.value?.id) });
    await updateSheetItem<UpdateProjectInput>(variables, updateProject);
    isModalVisible.value = false;
    projects.value = await fetchProject();
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
</script>

<style scoped>
  .project-detail {
    padding: 20px;
  }

  .project-header {
    display: flex;
    justify-content: space-between;
  }

  .project-header__title {
    font: 500 20px/28px "Roboto";
    letter-spacing: 0.15px;
    color: #2e2e2e;
    margin: 0 0 24px;
  }

  .project-detail__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .project-detail__row {
    display: flex;
    gap: 20px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 16px;
  }

  .project-detail__label {
    font: 500 14px/24px "Roboto";
    letter-spacing: 0.15px;
    color: #2e2e2e;
    min-width: 160px;
  }

  .project-detail__value {
    font: 400 14px/24px "Roboto";
    letter-spacing: 0.15px;
    color: #2e2e2e;
  }
  .p-button {
    display: flex;
    align-items: center;
    gap: 5px;
    font: 500 14px/24px "Roboto";
    color: #c63031;
    letter-spacing: 0.4px;
    width: 220px;
    height: 40px;
  }
</style>
