<template>
  <div>
    <div v-if="project" class="project-detail">
      <h2 class="project-detail__title">{{ project.name }}</h2>
      <div class="project-detail__body">
        <div class="project-detail__row">
          <span class="project-detail__label">Internal Name</span>
          <span class="project-detail__value">{{ project.internal_name }}</span>
        </div>
        <div class="project-detail__row">
          <span class="project-detail__label">Domain</span>
          <span class="project-detail__value">{{ project.domain }}</span>
        </div>
        <div class="project-detail__row">
          <span class="project-detail__label">Start Date</span>
          <span class="project-detail__value">{{ project.start_date }}</span>
        </div>
        <div class="project-detail__row">
          <span class="project-detail__label">End Date</span>
          <span class="project-detail__value">{{ project.end_date || "N/A" }}</span>
        </div>
        <div class="project-detail__row">
          <span class="project-detail__label">Description</span>
          <span class="project-detail__value">{{ project.description }}</span>
        </div>
        <div class="project-detail__row">
          <span class="project-detail__label">Environment</span>
          <span class="project-detail__value">{{ project.environment?.join(", ") }}</span>
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
