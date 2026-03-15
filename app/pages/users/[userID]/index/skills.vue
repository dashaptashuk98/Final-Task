<template>
  <div class="skills-page">
    <div v-if="loading" class="loading">Loading skills...</div>
    <div v-else-if="error" class="error">Error: {{ error }}</div>

    <SkillsComponent
      v-else
      :skills="userSkillsList"
      :delete-mode="deleteMode"
      :selected-skills="selectedSkillsToDelete"
      :read-only="!isOwner"
      @skill-click="handleSkillClick"
      @toggle-skill="toggleSkillForDeletion" />

    <div v-if="isOwner" class="actions__wrapper">
      <AddRemoveButtons
        :is-select-mode="deleteMode"
        :select-counter="selectedSkillsToDelete.size"
        page-title="skill"
        @activate-modal="
          (type) => {
            modalType = type;
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
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, reactive, watch } from "vue";
  import { useUsers } from "~/composables/useUsers";
  import SkillsComponent from "~/components/SkillsComponent.vue";
  import SkillForm from "~/components/SkillForm.vue";
  import ModalDialog from "~/components/ModalDialog.vue";
  import AddRemoveButtons from "~/components/AddRemoveButtons.vue";
  import type { InputType } from "~/types/types";
  import type { UserSkill, SkillFormKey } from "~/types/skills.d";
  import { MASTERY_OPTIONS } from "~/types/skills.d";
  import { updateSkillMutation } from "~/graphQL/skills/skillsUpdate.mutation";
  import { createSkillMutation } from "~/graphQL/skills/skillsCreate.mutations";
  import { deleteProfileSkillMutation } from "~/graphQL/skills/skillDelete.mutation";
  import { checkRights } from "~/utils/rights-checker";

  const { user, userSkills, fetchUserSkills, fetchSkillCategories, fetchSkills, skills } =
    useUsers();
  const { authUser } = useAuth();
  const route = useRoute();
  const userId = route.params.userID as string;
  const isOwner = computed(() => String(authUser.value?.id) === userId);
  const modalType = ref<string>("");
  const loading = ref(true);
  const error = ref<string | null>(null);
  const visible = ref(false);
  const selectedSkill = ref<UserSkill | null>(null);
  const mutationLoading = ref(false);
  const deleteMode = ref(false);
  const selectedSkillsToDelete = ref<Set<string>>(new Set());
  const errorMessage = ref<string>("");
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

  const handleSkillClick = (skill: UserSkill) => {
    if (!isOwner.value || deleteMode.value) return;
    selectedSkill.value = skill;
    const matchingSkill = skills.value?.find((s) => s.name === skill.name);
    formData.skill.value = matchingSkill?.name || skill.name;
    formData.mastery.value = skill.mastery || "Novice";
    modalType.value = "Update";
    visible.value = true;
  };

  const handleFormSubmit = async (
    data: Record<SkillFormKey, InputType>,
    action: string,
  ): Promise<void> => {
    if (!checkRights(userId)) {
      errorMessage.value = "You don't have permission to perform this action";
      return;
    }

    if (!user.value?.id || !data.skill.value) {
      errorMessage.value = "Insufficient data to perform the operation";
      return;
    }

    try {
      mutationLoading.value = true;
      errorMessage.value = "";
      const { $apollo } = useNuxtApp();

      if (action === "Add") {
        const selectedSkillData = skills.value?.find(
          (s) => s.id === data.skill.value || s.name === data.skill.value,
        );

        if (!selectedSkillData) {
          errorMessage.value = "Selected skill not found";
          return;
        }

        if (userSkills.value?.some((s) => s.name === selectedSkillData.name)) {
          errorMessage.value = `Skill "${selectedSkillData.name}" is already added`;
          return;
        }

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
      } else if (action === "Update") {
        if (!selectedSkill.value) {
          errorMessage.value = "No skill selected for update";
          return;
        }

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
          visible.value = false;
        }
      }
    } catch (err) {
      errorMessage.value =
        err instanceof Error
          ? err.message
          : `Error ${action === "Add" ? "adding" : "updating"} skill. Please try again.`;
    } finally {
      mutationLoading.value = false;
    }
  };

  const handleCancel = () => {
    formData.skill.value = "";
    formData.mastery.value = "Novice";
    selectedSkill.value = null;
  };

  const toggleSkillForDeletion = (skillName: string) => {
    if (selectedSkillsToDelete.value.has(skillName)) {
      selectedSkillsToDelete.value.delete(skillName);
    } else {
      selectedSkillsToDelete.value.add(skillName);
    }
  };

  const cancelDeleteMode = () => {
    deleteMode.value = false;
    selectedSkillsToDelete.value.clear();
  };

  const handleDeleteSkills = async (): Promise<void> => {
    try {
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
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Error deleting skills";
    } finally {
      mutationLoading.value = false;
    }
  };

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

      await Promise.all([fetchSkillCategories(), fetchSkills(), fetchUserSkills(userId)]);
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
      const categoryName = skillInfo?.category_name || "No category";

      return {
        ...userSkill,
        category_name: categoryName,
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

  :global(.p-select-overlay) {
    z-index: 10001 !important;
  }

  :global(.p-select-panel) {
    background: white !important;
    border: 1px solid #e0e0e0 !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
  }

  @media (max-width: 768px) {
    .skills-page {
      padding: 0.5rem;
    }

    .actions__wrapper {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }

    :global(.p-dialog) {
      width: 90% !important;
      max-width: 450px;
      margin: 0 auto;
    }
  }
</style>
