<script setup lang="ts">
  const input = ref<string>("");
  const emit = defineEmits<{ (event: "submitSearch", input: string): void }>();
  const clearSearchInput = (): void => {
    input.value = "";
    emit("submitSearch", input.value);
  };
</script>

<template>
  <IconField>
    <InputIcon class="pi pi-search" @click="emit('submitSearch', input)" />
    <InputText v-model="input" placeholder="Search" @keydown.enter="emit('submitSearch', input)" />
    <Button v-if="input.length > 0" icon="pi pi-times" @click="clearSearchInput" />
  </IconField>
</template>

<style scoped>
  .p-iconfield {
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 320px;
    height: 40px;
    padding: 0 20px;
    margin-left: 20px;
    border: 1px #0000003b solid;
    border-radius: 40px;
  }

  .p-inputicon {
    position: static;
    color: #0000008a;
    cursor: pointer;
  }

  .p-inputtext {
    font: 400 16px/32px "Roboto";
    color: #2e2e2e;
    opacity: 0.8;
  }

  :deep(.p-button-icon) {
    color: #0000008a;
  }
</style>
