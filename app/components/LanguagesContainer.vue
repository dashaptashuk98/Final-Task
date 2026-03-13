<script setup lang="ts">
  import type { LanguageProficiency } from "~/types/languages";
  import type { KeyValue, SelectableItem } from "~/types/types";

  const route = useRoute();
  const { data, isSelectMode } = defineProps<{
    data: LanguageProficiency[];
    isSelectMode: boolean;
  }>();
  const emit = defineEmits<{
    (event: "activateModal", title: string, selectedItem?: KeyValue): void;
    (event: "updateCounter", counter: number): void;
    (event: "updateItems", items: SelectableItem[]): void;
  }>();
  const pageItems = ref<SelectableItem[]>([]);
  for (const item of data) {
    pageItems.value.push({ name: item.name, isChecked: false });
  }

  watch(
    () => data,
    (curr) => {
      pageItems.value.length = 0;
      for (const item of curr) {
        pageItems.value.push({ name: item.name, isChecked: false });
      }
    },
  );

  watch(pageItems.value, (curr) => {
    const counter = curr.reduce((acc, item) => acc + (item.isChecked ? 1 : 0), 0);
    emit("updateCounter", counter);
    emit("updateItems", pageItems.value);
  });
  const activateUpdateModal = (item: LanguageProficiency): void => {
    if (!isSelectMode && checkRights(route.params.userID as string)) {
      emit("activateModal", "Update", { key: item.name, value: item.proficiency });
    }
  };
</script>

<template>
  <div class="user-languages-container">
    <div
      v-for="(item, index) in data"
      :key="item.name"
      class="language"
      @click="() => activateUpdateModal(item)">
      <Checkbox
        v-if="isSelectMode"
        v-model="(pageItems[index] as SelectableItem).isChecked"
        class="language__checkbox"
        binary />
      <span :class="`language__proficiency language__proficiency_${item.proficiency}`">{{
        item.proficiency
      }}</span>
      <span class="language__language">{{ item.name }}</span>
    </div>
  </div>
</template>

<style scoped>
  .user-languages-container {
    display: flex;
    flex-wrap: wrap;
    padding: 32px 24px;
    gap: 100px;
  }

  .language {
    display: flex;
    align-items: center;
    gap: 50px;
  }

  .language__checkbox {
    border: 1px #767676 solid;
    border-radius: 2px;
    width: 16px;
    height: 16px;
  }

  .language__proficiency,
  .language__language {
    font: 400 16px/24px "Roboto";
  }

  .language__language {
    color: #767676;
  }

  .language__proficiency {
    font-weight: 600;
  }

  .language__proficiency_A1,
  .language__proficiency_A2 {
    color: #0288d1;
  }

  .language__proficiency_B1,
  .language__proficiency_B2 {
    color: #2e7d32;
  }

  .language__proficiency_C1,
  .language__proficiency_C2 {
    color: #ffb800;
  }

  .language__proficiency_Native {
    color: #c63031;
  }
</style>
