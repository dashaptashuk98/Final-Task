<template>
  <div class="skills-container">
    <div
      v-for="(categorySkills, categoryName) in groupedSkills"
      :key="categoryName"
      class="category-block">
      <h3 class="category-title">{{ categoryName }}</h3>

      <div class="skills-list">
        <div v-for="skill in categorySkills" :key="skill.id" class="skill-item">
          <div v-if="props.deleteMode" class="checkbox-wrapper">
            <input
              :id="`skill-${skill.name}`"
              type="checkbox"
              :checked="props.selectedSkills?.has(skill.name)"
              class="custom-checkbox"
              @change="$emit('toggle-skill', skill.name)" >
            <label :for="`skill-${skill.name}`" class="checkbox-label" />
          </div>

          <div
            class="skill-content"
            @click="!props.deleteMode && !props.readOnly && $emit('skill-click', skill)">
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
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import ProgressBar from "primevue/progressbar";
  import type { Mastery, UserSkill } from "~/types/skills";

  defineEmits<{
    "skill-click": [skill: UserSkill];
    "toggle-skill": [skillName: string];
  }>();

  interface Props {
    skills: UserSkill[];
    deleteMode?: boolean;
    selectedSkills?: Set<string>;
    readOnly?: boolean;
  }

  const props = defineProps<Props>();

  const getMasteryPercentage = (mastery?: Mastery): number => {
    if (!mastery) return 0;
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
    const groups: Record<string, UserSkill[]> = {};

    props.skills.forEach((skill) => {
      const category =
        (skill as UserSkill & { category_name?: string }).category_name || "Без категории";

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
    max-width: 800px;
    padding: 1rem;
  }

  .category-block {
    margin-bottom: 2rem;
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
    flex-wrap: wrap;
  }

  .skill-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    max-width: 200px;
  }

  .checkbox-wrapper {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    position: relative;
  }

  .custom-checkbox {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkbox-label {
    position: absolute;
    top: 0;
    left: 0;
    width: 18px;
    height: 18px;
    background-color: white;
    border: 2px solid #000000;
    border-radius: 3px;
    cursor: pointer;
  }

  .custom-checkbox:checked + .checkbox-label {
    background-color: #000000;
    border-color: #000000;
  }

  .custom-checkbox:checked + .checkbox-label::after {
    content: "";
    position: absolute;
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .skill-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    flex: 1;
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
