<script setup lang="ts">
  const route = useRoute();
  const { isSelectMode, selectCounter, pageTitle } = defineProps<{
    isSelectMode: boolean;
    selectCounter: number;
    pageTitle: string;
  }>();
  const emit = defineEmits<{
    (event: "toggleMode" | "handleRemove"): void;
    (event: "activateModal", value: string): void;
  }>();
</script>

<template>
  <div class="user-action-buttons">
    <Button
      type="button"
      :disabled="!checkRights(route.params.userID as string)"
      :label="!isSelectMode ? `add ${pageTitle}`.toLocaleUpperCase() : 'cancel'.toLocaleUpperCase()"
      :icon="!isSelectMode ? 'pi pi-plus' : ''"
      :class="!isSelectMode ? 'btn-add' : 'btn-cancel'"
      @click="!isSelectMode ? emit('activateModal', 'Add') : emit('toggleMode')" />

    <Button
      type="button"
      :disabled="!checkRights(route.params.userID as string)"
      :label="
        !isSelectMode ? `remove ${pageTitle}s`.toLocaleUpperCase() : 'delete'.toLocaleUpperCase()
      "
      :class="!isSelectMode ? 'btn-remove' : 'btn-delete'"
      :badge="!isSelectMode ? '' : String(selectCounter)"
      @click="!isSelectMode ? emit('toggleMode') : emit('handleRemove')">
      <template v-if="!isSelectMode" #icon>
        <IconRemove />
      </template>
    </Button>
  </div>
</template>

<style scoped>
  .user-action-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    margin-top: 2rem;
  }

  :deep(.p-button-label) {
    font: 500 14px/24px "Roboto";
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

  .btn-cancel {
    min-width: 120px;
    height: 44px;
    border-radius: 22px;
    background-color: transparent;
    border: 1px solid #9b9b9b;
    color: #9b9b9b;
    font:
      600 13px/1 "Roboto",
      sans-serif;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0 24px;
  }

  .btn-cancel:hover {
    background-color: rgba(155, 155, 155, 0.1);
  }

  .btn-delete {
    min-width: 140px;
    height: 44px;
    border-radius: 22px;
    background-color: #dc3545;
    color: white;
    border: none;
    font:
      600 13px/1 "Roboto",
      sans-serif;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-delete:hover {
    background-color: #c82333;
  }

  .btn-delete .badge {
    background-color: white;
    color: #dc3545;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
  }
</style>
