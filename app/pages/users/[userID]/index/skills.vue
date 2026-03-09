<template>
  <div class="skills-page">
    <HeaderComponent />

    <div v-if="pending" class="loading">Загрузка навыков...</div>
    <div v-else-if="error" class="error">Ошибка при загрузке: {{ error }}</div>

    <SkillsComponent v-else :skills="skills" @skill-click="handleSkillClick" />

    <div class="actions__wrapper">
      <Button
        type="button"
        label="Add skill"
        icon="pi pi-plus"
        class="btn-add"
        @click="visible = true" />

<<<<<<< HEAD
      <Dialog
        v-model:visible="visible"
        header="Add Skill"
        :style="{ width: '450px' }"
        modal
        :closable="true"
        :dismissable-mask="true">
        <SkillsForm
          :data="formData as Record<SkillForm, InputType>"
          @cancel="handleCancel"
          @save="handleSaveSkill" />
      </Dialog>

      <Dialog
        v-model:visible="visibleUpdate"
        header="Update skill"
        :style="{ width: '450px' }"
        modal
        :closable="true"
        :dismissable-mask="true">
        <SkillsForm
          :data="formData as Record<SkillForm, InputType>"
          @cancel="handleCancel"
          @save="handleSkillSave" />
      </Dialog>

      <div class="button__wrapper">
        <IconRemove />
        <Button type="button" label="Remove skills" class="btn-remove" />
      </div>
=======
      <div v-if="!deleteMode" class="button__wrapper">
        <IconRemove />
        <Button type="button" label="Remove skills" class="btn-remove" @click="deleteMode = true" />
      </div>

      <button v-if="deleteMode" type="button" class="btn-cancel" @click="cancelDeleteMode">
        CANCEL
      </button>

      <button
        v-if="deleteMode && selectedSkillsToDelete.size > 0"
        type="button"
        class="btn-delete"
        @click="handleDeleteSkills">
        DELETE
        <span class="badge">{{ selectedSkillsToDelete.size }}</span>
      </button>
      <ModalDialog v-model:visible="visible" header="Add Skill">
        <SkillForm
          :data="formData"
          :loading="mutationLoading"
          @cancel="handleCancel"
          @save="handleSaveSkill" />
      </ModalDialog>
      <ModalDialog v-model:visible="visibleUpdate" header="Update skill">
        <SkillForm
          :data="formData"
          :loading="mutationLoading"
          @cancel="handleCancel"
          @save="handleSkillUpdate" />
      </ModalDialog>
>>>>>>> 13e0d03 (fix: add modal component)
    </div>
  </div>
</template>

<script setup lang="ts">
<<<<<<< HEAD
  import { ref } from "vue";
  import IconRemove from "~/components/IconRemove.vue";
  import SkillsForm from "~/components/SkillForm.vue";
  import SkillsComponent from "~/components/SkillsComponent.vue";
  import HeaderComponent from "~/components/HeaderComponent.vue";
  import type { InputType } from "~/types/types";

  definePageMeta({
    middleware: "auth",
  });

  type Mastery = "Novice" | "Advanced" | "Competent" | "Proficient" | "Expert";
  type SkillForm = "skill" | "mastery";
=======
  import { ref, computed, onMounted, reactive, watch } from "vue";
  import { useUsers } from "~/composables/useUsers";
  import SkillsComponent from "~/components/SkillsComponent.vue";
  import SkillForm from "~/components/SkillForm.vue";
  import ModalDialog from "~/components/ModalDialog.vue";
  import type { InputType } from "~/types/types";
  import type { UserSkill, SkillFormKey } from "~/types/skills.d";
  import { MASTERY_OPTIONS } from "~/types/skills.d";
  import { updateSkillMutation } from "~/graphQL/skills/skillsUpdate.mutation";
  import { createSkillMutation } from "~/graphQL/skills/skillsCreate.mutations";
  import { deleteProfileSkillMutation } from "~/graphQL/skills/skillDelete.mutation";

  const { user, userSkills, fetchUserSkills, fetchSkillCategories, fetchSkills, skills } =
    useUsers();
>>>>>>> 13e0d03 (fix: add modal component)

  const visible = ref(false);
  const visibleUpdate = ref(false);

  const selectedSkill = ref<Skill | null>(null);
  const isEditMode = ref(false);
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

  const masteryOptions = [
    { name: "Novice" },
    { name: "Advanced" },
    { name: "Competent" },
    { name: "Proficient" },
    { name: "Expert" },
  ];

  const skillOptions = [
    { name: "JavaScript", category: "Programming languages", parent: null },
    { name: "TypeScript", category: "Programming languages", parent: null },
    { name: "React", category: "Frontend technologies", parent: "Frontend" },
    { name: "Vue", category: "Frontend technologies", parent: "Frontend" },
    { name: "Node.js", category: "Backend technologies", parent: "Backend" },
  ];

  const formData = reactive({
    skill: {
      key: "skill",
      label: "Skill",
      value: "",
      type: "Select",
      values: skillOptions,
    },
    mastery: {
      key: "mastery",
      label: "Mastery Level",
      value: "Novice",
      type: "Select",
      values: masteryOptions,
    },
  });

<<<<<<< HEAD
  const skills = ref<Skill[]>(mockUserSkills);
  const pending = ref(false);
  const error = ref<string | null>(null);

  const handleSkillClick = (skill: Skill) => {
    selectedSkill.value = skill;
    formData.skill.value = skill.name;
    formData.mastery.value = skill.mastery;
=======
  const handleSkillClick = (skill: UserSkill) => {
    selectedSkill.value = skill;
    const matchingSkill = skills.value?.find((s) => s.name === skill.name);
    formData.skill.value = matchingSkill?.name || skill.name;
    formData.mastery.value = skill.mastery || "Novice";
>>>>>>> 13e0d03 (fix: add modal component)
    visibleUpdate.value = true;
    isEditMode.value = true;
  };

<<<<<<< HEAD
  const handleSkillSave = (data: Record<SkillForm, InputType>) => {
    if (isEditMode.value && selectedSkill.value) {
      skills.value = skills.value.map((e) =>
        e.id === selectedSkill.value?.id
          ? {
              ...e,
              name: data.skill.value as string,
              mastery: data.mastery.value as Mastery,
            }
          : e,
      );
=======
  const handleSaveSkill = async (data: Record<SkillFormKey, InputType>) => {
    try {
      if (!user.value?.id || !data.skill.value) return;

      const selectedSkillData = skills.value?.find(
        (s) => s.id === data.skill.value || s.name === data.skill.value,
      );

      if (!selectedSkillData || userSkills.value?.some((s) => s.name === selectedSkillData.name))
        return;

      mutationLoading.value = true;
      const { $apollo } = useNuxtApp();

      const response = await $apollo.clients.default.mutate({
        mutation: createSkillMutation,
        variables: {
          skill: {
            userId: String(user.value.id),
            name: selectedSkillData.name,
            categoryId: String(selectedSkillData.category?.id),
            mastery: data.mastery.value,
          },
        },
      });

      if (response?.data?.addProfileSkill) {
        userSkills.value = response.data.addProfileSkill.skills;
        visible.value = false;
        handleCancel();
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Error saving skill";
    } finally {
      mutationLoading.value = false;
    }
  };

  const handleSkillUpdate = async (data: Record<SkillFormKey, InputType>) => {
    try {
      if (!selectedSkill.value || !user.value?.id) return;

      mutationLoading.value = true;
      const { $apollo } = useNuxtApp();

      const response = await $apollo.clients.default.mutate({
        mutation: updateSkillMutation,
        variables: {
          skill: {
            name: selectedSkill.value.name,
            mastery: data.mastery.value,
            userId: String(user.value.id),
          },
        },
      });

      if (response?.data?.updateProfileSkill) {
        userSkills.value = response.data.updateProfileSkill.skills;
        visibleUpdate.value = false;
        handleCancel();
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Error updating skill";
    } finally {
      mutationLoading.value = false;
>>>>>>> 13e0d03 (fix: add modal component)
    }
  };

  const handleSaveSkill = (data: Record<SkillForm, InputType>) => {
    if (data.skill.value && data.mastery.value) {
      const selectedSkillOption = skillOptions.find((option) => option.name === data.skill.value);

      const newSkill: Skill = {
        id: Date.now().toString(),
        name: data.skill.value as string,
        mastery: data.mastery.value as Mastery,
        category_name: selectedSkillOption?.category || "Other",
        category_parent_name: selectedSkillOption?.parent || null,
      };

      skills.value = [...skills.value, newSkill];
    }

    visible.value = false;
    data.skill.value = "";
    data.mastery.value = "Novice";
  };

  const handleCancel = () => {
    formData.skill.value = "";
    formData.mastery.value = "Novice";
  };

  const fetchSkills = async () => {
    pending.value = true;
    error.value = null;

    try {
<<<<<<< HEAD
      // const response = await $fetch('/api/user/skills');
      // skills.value = response;
      await new Promise((resolve) => setTimeout(resolve, 500));
      skills.value = mockUserSkills;
=======
      if (!user.value?.id || selectedSkillsToDelete.value.size === 0) return;

      mutationLoading.value = true;
      const { $apollo } = useNuxtApp();

      for (const skillName of selectedSkillsToDelete.value) {
        const response = await $apollo.clients.default.mutate({
          mutation: deleteProfileSkillMutation,
          variables: {
            skill: {
              userId: String(user.value.id),
              name: skillName,
            },
          },
        });

        if (response?.data?.deleteProfileSkill) {
          userSkills.value = response.data.deleteProfileSkill.skills;
        }
      }

      cancelDeleteMode();
>>>>>>> 13e0d03 (fix: add modal component)
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      pending.value = false;
    }
  };
<<<<<<< HEAD
  fetchSkills();
=======

  watch(
    () => skills.value,
    (newSkills) => {
      if (newSkills && newSkills.length > 0) {
        formData.skill.values = newSkills.map((skill) => ({
          name: skill.name,
          value: skill.id,
          category: skill.category,
          category_name: skill.category_name,
        }));
      }
    },
    { immediate: true },
  );

  onMounted(async () => {
    try {
      loading.value = true;
      error.value = null;

      if (!user.value?.id) {
        error.value = "User not authenticated";
        return;
      }

      await Promise.all([fetchSkillCategories(), fetchSkills(), fetchUserSkills(user.value.id)]);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Error loading skills";
    } finally {
      loading.value = false;
    }
  });

  const userSkillsList = computed(() => {
    if (!userSkills.value || userSkills.value.length === 0) return [];

    return userSkills.value.map((userSkill) => {
      const skillInfo = skills.value?.find((s) => s.name === userSkill.name);
      const categoryName = skillInfo?.category_name || "Без категории";

      return {
        ...userSkill,
        category_name: categoryName,
      };
    });
  });
>>>>>>> 13e0d03 (fix: add modal component)
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

  .btn-add :deep(.p-button-icon) {
    color: #767676;
    margin-right: 8px;
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

  .button__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  :global(.p-dialog-mask) {
    background-color: rgba(0, 0, 0, 0.5) !important;
    z-index: 9999 !important;
  }

  :global(.p-dialog) {
    border-radius: 12px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
    background: white !important;
    z-index: 10000 !important;
  }

  :global(.p-dialog-header) {
    padding: 1.5rem !important;
    background: white !important;
    border-bottom: 1px solid #e0e0e0 !important;
    border-radius: 12px 12px 0 0 !important;
  }

  :global(.p-dialog-title) {
    font-weight: 600 !important;
    font-size: 1.25rem !important;
    color: #333 !important;
  }

  :global(.p-dialog-header-icons) {
    display: flex !important;
    align-items: center !important;
  }

  :global(.p-dialog-header-close) {
    background: transparent !important;
    border: none !important;
    color: #666 !important;
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: background-color 0.2s !important;
  }

  :global(.p-dialog-header-close:hover) {
    background: #f5f5f5 !important;
  }

  :global(.p-dialog-content) {
    padding: 1.5rem !important;
    background: white !important;
    border-radius: 0 0 12px 12px !important;
  }

  /* Стили для формы внутри диалога */
  :global(.p-dialog .form) {
    margin-top: 0 !important;
  }

  :global(.p-dialog .form-input-wrapper) {
    flex-direction: column !important;
    gap: 20px !important;
  }

  :global(.p-dialog .form-input-container) {
    width: 100% !important;
  }

  :global(.p-dialog .custom-select),
  :global(.p-dialog .custom-input) {
    width: 100% !important;
  }

  /* Стили для выпадающих списков селектов */
  :global(.p-select-overlay) {
    z-index: 10001 !important;
  }

  :global(.p-select-panel) {
    background: white !important;
    border: 1px solid #e0e0e0 !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
  }

  /* Адаптивность */
  @media (max-width: 768px) {
    .skills-page {
      padding: 0.5rem;
    }

    .actions__wrapper {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }

    .btn-add :deep(.p-button),
    .btn-remove :deep(.p-button) {
      width: 100%;
    }

    :global(.p-dialog) {
      width: 90% !important;
      max-width: 450px;
      margin: 0 auto;
    }
  }
</style>
