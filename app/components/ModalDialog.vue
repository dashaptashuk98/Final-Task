<template>
  <Dialog
    v-model:visible="isVisible"
    :header="header"
    :style="{ width: '450px' }"
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
    z-index: 9999;
  }

  .p-dialog {
    border-radius: 12px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
    background: white !important;
    z-index: 10000;
    padding: 15px !important;
  }

  .p-dialog-header {
    padding-bottom: 1.5rem !important;
    background: white;
    border-radius: 12px 12px 0 0;
  }

  .p-dialog-title {
    font: 500 16px/24px "Roboto";
    font-weight: 600 !important;
    font-size: 1.25rem !important;
    color: #333;
  }

  .p-dialog-header-icons {
    display: flex;
    align-items: center;
  }

  .p-dialog-header-close {
    background: transparent;
    border: none;
    color: #666;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .p-dialog-header-close:hover {
    background: #f5f5f5;
  }

  .p-dialog-content {
    padding: 1.5rem;
    background: white;
    border-radius: 0 0 12px 12px;
  }
</style>
