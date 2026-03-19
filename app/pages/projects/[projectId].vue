<template>
  <div>
    <div v-if="project" class="project-detail">
      <h2 class="project-detail__title">{{ project.name }}</h2>
      <div class="project-detail__body">
        <div v-for="row in rows" :key="row.label" class="project-detail__row">
          <span class="project-detail__label">{{ row.label }}</span>
          <span class="project-detail__value">{{ row.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  const route = useRoute();
  const projectId = route.params.projectId as string;
  const { projects, fetchProject } = useCvs();

  await callOnce(() => fetchProject());

  const project = computed(() => projects.value.find((p) => p.id === projectId));

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
</script>

<style scoped>
  .project-detail {
    padding: 20px;
    max-width: 900px;
  }

  .project-detail__title {
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
</style>
