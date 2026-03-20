<script setup lang="ts">
  import LanguagesContainer from "~/components/LanguagesContainer.vue";
  import type {
    Language,
    LanguageFormKeys,
    LanguageQueryVars,
    LanguageQueryVarsExt,
  } from "~/types/languages";
  import type { InputType, KeyValue, Nullable, SelectableItem, SelectValues } from "~/types/types";
  import type { Profile } from "~/types/user";

  definePageMeta({
    middleware: "auth",
    layout: "default",
  });
  const { fetchProfile, addProfileLanguage, updateProfileLanguage, deleteProfileLanguage } =
    useUsers();
  const { fetchLanguages } = useLanguages();
  const route = useRoute();
  const isSelectMode = ref<boolean>(false);
  const isModalVisible = ref<boolean>(false);
  const selectCounter = ref<number>(0);
  const profileData = useState<Nullable<Profile>>(() => null);
  const fetchedOptions = useState<Nullable<Language[]>>(() => null);
  const modalType = ref<string>("");
  const languages = ref<SelectableItem[]>([]);
  const errorMessage = ref<string>("");

  profileData.value = await fetchProfile(route.params.userID as string);
  fetchedOptions.value = await fetchLanguages();
  const options = ref<SelectValues[]>([]);

  if (fetchedOptions.value) {
    options.value = fetchedOptions.value?.map((item) => {
      return { name: item.name };
    });
  }

  const formData = reactive<Record<LanguageFormKeys, InputType>>({
    language: {
      key: "language",
      label: "Language",
      value: "",
      type: "Select",
      values: options.value,
    },
    proficiency: {
      key: "proficiency",
      label: "Language proficiency",
      value: "B1",
      type: "Select",
      values: [
        { name: "A1" },
        { name: "A2" },
        { name: "B1" },
        { name: "B2" },
        { name: "C1" },
        { name: "C2" },
        { name: "Native" },
      ],
    },
  });

  const activateModal = (title: string, itemData?: KeyValue): string => {
    errorMessage.value = "";
    if (itemData) {
      formData.language.value = itemData.key;
      formData.proficiency.value = itemData.value;
    } else {
      formData.language.value = "";
      formData.proficiency.value = "B1";
    }
    isModalVisible.value = !isModalVisible.value;
    modalType.value = title;
    return title;
  };

  const handleFormSubmit = async (
    data: Record<LanguageFormKeys, InputType>,
    action: string,
  ): Promise<void> => {
    const vars: LanguageQueryVarsExt = {
      userId: Number(route.params.userID),
      name: data.language.value as string,
      proficiency: data.proficiency.value as string,
    };
    if (action === "Add") {
      if (profileData.value?.languages.some((item) => item.name === vars.name)) {
        errorMessage.value = `${vars.name} is already exists`;
        return;
      }
      profileData.value = await addProfileLanguage(vars);
    } else if (action === "Update") {
      profileData.value = await updateProfileLanguage(vars);
    }
    isModalVisible.value = false;
    return;
  };

  const removeLanguages = async (): Promise<void> => {
    const selectedLanguages = languages.value
      .filter((item) => item.isChecked)
      .map((item) => {
        return item.name;
      });
    const vars: LanguageQueryVars = {
      userId: Number(route.params.userID),
      name: selectedLanguages,
    };
    profileData.value = await deleteProfileLanguage(vars);
    isSelectMode.value = false;
    selectCounter.value = 0;
    return;
  };
</script>

<template>
  <section class="user-languages">
    <LanguagesContainer
      v-if="profileData"
      :data="profileData.languages"
      :is-select-mode
      @activate-modal="activateModal"
      @update-counter="(counter: number) => (selectCounter = counter)"
      @update-items="(items: SelectableItem[]) => (languages = items)" />
    <AddRemoveButtons
      :is-select-mode
      :select-counter="selectCounter"
      page-title="language"
      @toggle-mode="() => (isSelectMode = !isSelectMode)"
      @activate-modal="activateModal"
      @handle-remove="removeLanguages" />
    <ModalDialog
      v-model:visible="isModalVisible"
      :header="`${modalType} language`"
      @update:visible="(value) => (isModalVisible = value)">
      <SkillForm
        :data="formData"
        :action="modalType"
        :error-message="errorMessage"
        @cancel="() => (isModalVisible = false)"
        @save="handleFormSubmit" />
    </ModalDialog>
  </section>
</template>

<style scoped>
  .user-languages {
    max-width: 900px;
    margin: 0 auto;
  }
</style>
