<template>
  <div class="skills-page">
    <HeaderComponent />

    <div v-if="pending" class="loading">Загрузка навыков...</div>

    <div v-else-if="error" class="error">Ошибка при загрузке: {{ error }}</div>

    <SkillsComponent v-else :skills="skills" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  type Mastery = "Novice" | "Advanced" | "Competent" | "Proficient" | "Expert";

  interface Skill {
    id: string;
    name: string;
    mastery: Mastery;
    category_name: string | null;
    category_parent_name: string | null;
  }

  const mockUserSkills: Skill[] = [
    {
      id: "1",
      name: "JavaScript",
      mastery: "Expert",
      category_name: "Programming languages",
      category_parent_name: null,
    },
    {
      id: "2",
      name: "TypeScript",
      mastery: "Proficient",
      category_name: "Programming languages",
      category_parent_name: null,
    },
    {
      id: "3",
      name: "React",
      mastery: "Advanced",
      category_name: "Frontend technologies",
      category_parent_name: "Frontend",
    },
    {
      id: "4",
      name: "Vue",
      mastery: "Competent",
      category_name: "Frontend technologies",
      category_parent_name: "Frontend",
    },
    {
      id: "5",
      name: "Node.js",
      mastery: "Novice",
      category_name: "Backend technologies",
      category_parent_name: "Backend",
    },
  ];

  const skills = ref<Skill[]>(mockUserSkills);
  const pending = ref(false);
  const error = ref<string | null>(null);
</script>

<style scoped>
  .skills-page {
    min-height: 100vh;
  }

  .loading,
  .error {
    text-align: center;
    font-size: 1.2rem;
  }

  .loading {
    color: #666;
  }

  .error {
    color: #c63031;
  }
</style>
