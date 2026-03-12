<template>
  <Dialog
    v-model:visible="isVisible"
    :header="header"
    :style="{ width: width || '450px', maxWidth: '90vw' }"
    modal
    :closable="true"
    :dismissable-mask="true">
    <slot />
  </Dialog>
</template>

<script setup lang="ts">
  interface Props {
    visible: boolean;
    header: string;
    width?: string;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    "update:visible": [value: boolean];
  }>();

  const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit("update:visible", value),
  });
</script>

<style>
  .p-dialog-mask {
    background-color: rgba(0, 0, 0, 0.5) !important;
    z-index: 9999 !important;
  }

  .p-dialog {
    border-radius: 12px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
    background: white !important;
    z-index: 10000 !important;
  }

  .p-dialog-header {
    padding: 1.5rem !important;
    background: white !important;
    border-bottom: 1px solid #e0e0e0 !important;
    border-radius: 12px 12px 0 0 !important;
  }

  .p-dialog-title {
    font-weight: 600 !important;
    font-size: 1.25rem !important;
    color: #333 !important;
  }

  .p-dialog-header-icons {
    display: flex !important;
    align-items: center !important;
  }

  .p-dialog-header-close {
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

  .p-dialog-header-close:hover {
    background: #f5f5f5 !important;
  }

  .p-dialog-content {
    padding: 1.5rem !important;
    background: white !important;
    border-radius: 0 0 12px 12px !important;
  }

  .p-dialog .form {
    margin-top: 0 !important;
  }

  .p-dialog .form-input-wrapper {
    flex-direction: column !important;
    gap: 20px !important;
  }

  .p-dialog .form-input-container {
    width: 100% !important;
  }

  .p-dialog .custom-select,
  .p-dialog .custom-input,
  .p-dialog .custom-datepicker,
  .p-dialog .custom-textarea,
  .p-dialog .custom-multiselect {
    width: 100% !important;
  }

  .p-select-overlay {
    z-index: 10001 !important;
  }

  .p-select-panel {
    background: white !important;
    border: 1px solid #e0e0e0 !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
  }

  @media (max-width: 768px) {
    .p-dialog {
      width: 90% !important;
      max-width: 450px;
      margin: 0 auto;
    }
  }
</style>
