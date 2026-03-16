<script setup lang="ts">
  const { buttonLabel } = defineProps<{ buttonLabel: string }>();
  const emit = defineEmits<{ (event: "submitSearch" | "activateForm", value: string): void }>();
</script>

<template>
  <div class="sheet-inputs">
    <SearchInput @submit-search="(input) => emit('submitSearch', input)" />
    <Button
      type="button"
      icon="pi pi-plus"
      :label="buttonLabel.toLocaleUpperCase()"
      @click="emit('activateForm', buttonLabel)"/>
  </div>
</template>

<style scoped>
  .sheet-inputs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }

  .p-button {
    display: flex;
    align-items: center;
    gap: 5px;
    font: 500 14px/24px "Roboto";
    color: #c63031;
    letter-spacing: 0.4px;
    width: 220px;
    height: 40px;
  }
</style>
