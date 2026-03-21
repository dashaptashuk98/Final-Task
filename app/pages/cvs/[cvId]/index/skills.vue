<template>
  <div class="skills-page">
    <div v-if="loading" class="loading">Загрузка навыков...</div>
    <div v-else-if="error" class="error">Ошибка: {{ error }}</div>

    <SkillsComponent
      v-else
      :skills="cvSkillsList"
      :delete-mode="deleteMode"
      :selected-skills="selectedSkillsToDelete"
      :read-only="!checkRights(cvOwnerId as string)"
      @skill-click="handleSkillClick"
      @toggle-skill="handleToggleSkill" />

    <AddRemoveButtons
      :is-select-mode="deleteMode"
      :select-counter="selectedSkillsToDelete.size"
      page-title="skill"
      @activate-modal="
        (type) => {
          modalType = type;
          errorMessage = '';
          visible = true;
        }
      "
      @toggle-mode="deleteMode = !deleteMode"
      @handle-remove="handleDeleteSkills" />

    <ModalDialog
      v-model:visible="visible"
      :header="`${modalType} skill`"
      @update:visible="(value) => (visible = value)">
      <SkillForm
        :data="formData"
        :loading="mutationLoading"
        :error-message="errorMessage"
        :action="modalType"
        @save="handleFormSubmit"
        @cancel="() => (visible = false)" />
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, reactive, watch } from "vue";
  import { useUsers } from "~/composables/useUsers";
  import SkillsComponent from "~/components/SkillsComponent.vue";
  import SkillForm from "~/components/SkillForm.vue";
  import ModalDialog from "~/components/ModalDialog.vue";
  import AddRemoveButtons from "~/components/AddRemoveButtons.vue";
  import type { InputType } from "~/types/types";
  import type { UserSkill, SkillFormKey, SkillMastery } from "~/types/skills.d";
  import { MASTERY_OPTIONS } from "~/types/skills.d";

  const { fetchSkillCategories, fetchSkills, skills } = useUsers();
  const { cv, fetchCv, addCvSkill, updateCvSkill, deleteCvSkill } = useCvs();
  const route = useRoute();
  const cvId = route.params.cvId as string;
  const cvOwnerId = ref<string | null>(null);

  const loading = ref(true);
  const error = ref<string | null>(null);
  const errorMessage = ref<string>("");
  const visible = ref(false);
  const modalType = ref<string>("");
  const selectedSkill = ref<UserSkill | null>(null);
  const mutationLoading = ref(false);
  const deleteMode = ref(false);
  const selectedSkillsToDelete = ref<Set<string>>(new Set());

  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  try {
    await fetchCv(cvId);
    if (cv.value?.user?.id) {
      cvOwnerId.value = cv.value.user.id;
      route.params.userID = cv.value.user.id;
    }
    await Promise.all([fetchSkillCategories(), fetchSkills()]);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Error loading skills";
  } finally {
    loading.value = false;
  }

  const formData = reactive<Record<SkillFormKey, InputType>>({
    skill: {
      key: "skill",
      label: "Skill",
      value: "",
      type: "Select",
      values: [],
    },
    mastery: {
      key: "mastery",
      label: "Mastery Level",
      value: "Novice",
      type: "Select",
      values: MASTERY_OPTIONS,
    },
  });

  const handleFormSubmit = async (
    data: Record<SkillFormKey, InputType>,
    action: string,
  ): Promise<void> => {
    const selectedSkill = skills.value?.find((s) => s.name === data.skill.value);
    if (!selectedSkill) return;

    const skillInput = {
      cvId,
      name: data.skill.value as string,
      categoryId: selectedSkill.category?.id || "",
      mastery: data.mastery.value as string,
    };

    try {
      mutationLoading.value = true;

      if (action === "Add") {
        const existingSkill = cv.value?.skills.find(
          (item) => item.name.toLowerCase().trim() === skillInput.name.toLowerCase().trim(),
        );
        if (existingSkill) {
          errorMessage.value = `${skillInput.name} уже существует`;
          return;
        }

        cv.value = await addCvSkill(skillInput);
      } else if (action === "Update") {
        cv.value = await updateCvSkill(skillInput);
      }

      if (cv.value) {
        visible.value = false;
        handleCancel();
      }
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : "Ошибка при сохранении";
    } finally {
      mutationLoading.value = false;
    }
  };

  const handleSkillClick = (skill: UserSkill) => {
    if (deleteMode.value) return;
    if (!checkRights(cvOwnerId.value as string)) return;
    formData.skill.value = skill.name;
    formData.mastery.value = skill.mastery;
    selectedSkill.value = skill;
    modalType.value = "Update";
    visible.value = true;
  };

  const handleToggleSkill = (skillName: string) => {
    if (selectedSkillsToDelete.value.has(skillName)) {
      selectedSkillsToDelete.value.delete(skillName);
    } else {
      selectedSkillsToDelete.value.add(skillName);
    }
  };

  const handleDeleteSkills = async (): Promise<void> => {
    const selectedSkills = Array.from(selectedSkillsToDelete.value);

    if (selectedSkills.length === 0) return;

    const skillInput = {
      cvId,
      name: selectedSkills,
    };

    cv.value = await deleteCvSkill(skillInput);
    selectedSkillsToDelete.value.clear();
    deleteMode.value = false;
  };

  const handleCancel = () => {
    formData.skill.value = "";
    formData.mastery.value = "Novice";
    selectedSkill.value = null;
    errorMessage.value = "";
    visible.value = false;
  };

  watch(
    () => skills.value,
    (newSkills) => {
      if (newSkills && newSkills.length > 0) {
        formData.skill.values = newSkills.map((skill) => ({
          name: skill.name,
          value: skill.name,
          category: skill.category,
          category_name: skill.category_name,
        }));
      }
    },
    { immediate: true },
  );

  const normalizeSkillsData = (skillsData: SkillMastery[]) => {
    const uniqueSkills = new Map<string, SkillMastery>();

    skillsData.forEach((skill) => {
      const normalizedName = skill.name.trim();
      if (!uniqueSkills.has(normalizedName)) {
        uniqueSkills.set(normalizedName, {
          name: normalizedName,
          categoryId: skill.categoryId,
          mastery: skill.mastery,
          __typename: skill.__typename,
        });
      }
    });

    return Array.from(uniqueSkills.values());
  };

  const cvSkillsList = computed(() => {
    if (!cv.value?.skills || cv.value.skills.length === 0) return [];
    const normalizedSkills = normalizeSkillsData(cv.value.skills);

    return normalizedSkills.map((cvSkill) => {
      const fullSkill = skills.value?.find((s) => s.name === cvSkill.name);

      return {
        id: cvSkill.name,
        name: cvSkill.name,
        category_name: fullSkill?.category_name || "Без категории",
        mastery: cvSkill.mastery,
        categoryId: cvSkill.categoryId || fullSkill?.category?.id || null,
        category: fullSkill?.category || null,
        created_at: cv.value?.created_at || undefined,
      };
    });
  });
</script>

<style scoped>
  .skills-page {
    min-height: 100vh;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  .loading,
  .error {
    text-align: center;
    font-size: 1.2rem;
    padding: 2rem;
  }

  .loading {
    color: #666;
  }

  .error {
    color: #c63031;
  }

  .actions__wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    margin-top: 2rem;
  }
</style>
