<template>
  <div class="skills-container">
    <div
      v-for="(categorySkills, categoryName) in groupedSkills"
      :key="categoryName"
      class="category-block">
      <h3 class="category-title">{{ categoryName }}</h3>

      <div class="skills-list">
        <div v-for="skill in categorySkills" :key="skill.id" class="skill-item">
          <ProgressBar
            :value="getMasteryPercentage(skill.mastery)"
            class="skill-progress"
            :class="`mastery-${skill.mastery?.toLowerCase()}`"
            :show-value="false" />

          <div class="skill-info">
            <span class="skill-name">{{ skill.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import ProgressBar from "primevue/progressbar";

  type Mastery = "Novice" | "Advanced" | "Competent" | "Proficient" | "Expert";

  interface Skill {
    id: string;
    name: string;
    mastery: Mastery;
    category_name: string | null;
    category_parent_name: string | null;
  }

  interface Props {
    skills: Skill[];
  }

  const props = defineProps<Props>();

  const getMasteryPercentage = (mastery: Mastery): number => {
    const percentages: Record<Mastery, number> = {
      Novice: 20,
      Advanced: 40,
      Competent: 60,
      Proficient: 80,
      Expert: 100,
    };
    return percentages[mastery] || 0;
  };

  const groupedSkills = computed(() => {
    const groups: Record<string, Skill[]> = {};

    props.skills.forEach((skill) => {
      const category = skill.category_name || "Без категории";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(skill);
    });

    return groups;
  });
</script>

<style scoped>
  .skills-container {
    width: 100%;
    margin: 0 auto;
  }

  .category-block {
    margin-bottom: 16px;
    padding: 1rem;
  }

  .category-title {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #2e2e2e;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .skills-list {
    display: flex;
    gap: 116px;
  }

  .skill-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 150px;
  }

  .skill-info {
    display: flex;
    align-items: center;
  }

  .skill-name {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #767676;
    white-space: nowrap;
  }

  .skill-progress {
    width: 78px !important;
    min-width: 78px;
    max-width: 78px;
    height: 8px;
    background-color: #e3e3e3;
    border-radius: 4px;
  }

  .skill-progress :deep(.p-progressbar) {
    background-color: #e9ecef;
    border-radius: 4px;
    height: 8px;
    width: 78px !important;
  }

  .skill-progress.mastery-novice :deep(.p-progressbar-value) {
    background-color: #95a5a6;
    border-radius: 4px;
  }
  .skill-progress.mastery-advanced :deep(.p-progressbar-value) {
    background-color: #3498db;
    border-radius: 4px;
  }
  .skill-progress.mastery-competent :deep(.p-progressbar-value) {
    background-color: #2ecc71;
    border-radius: 4px;
  }
  .skill-progress.mastery-proficient :deep(.p-progressbar-value) {
    background-color: #f39c12;
    border-radius: 4px;
  }
  .skill-progress.mastery-expert :deep(.p-progressbar-value) {
    background-color: #c63031;
    border-radius: 4px;
  }

  @media (max-width: 600px) {
    .skills-container {
      padding: 0.5rem;
    }

    .category-block {
      padding: 0.75rem;
    }

    .category-title {
      font-size: 1.1rem;
    }

    .skill-item {
      gap: 0.5rem;
    }

    .skill-info {
      min-width: 80px;
    }

    .skill-progress {
      max-width: 200px;
    }
  }
</style>
