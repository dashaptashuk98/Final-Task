<template>
  <div v-if="isDeleteConfirmation" class="delete-confirmation">
    <p class="delete-question">
      {{ questionText || `Are you sure you want to delete ${itemType || "item"}` }}
      <strong>{{ itemName }}</strong
      >?
    </p>

    <div class="action-buttons">
      <Button
        :label="cancelText || 'CANCEL'"
        severity="secondary"
        class="cancel-btn"
        @click="handleCancel" />
      <Button
        :label="confirmText || 'CONFIRM'"
        severity="danger"
        class="confirm-btn"
        @click="handleConfirm" />
    </div>
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
  import { computed } from "vue";

  interface Props {
    context?: string;
    itemName?: string;
    itemType?: string;
    questionText?: string;
    cancelText?: string;
    confirmText?: string;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    cancel: [];
    confirm: [];
  }>();

  const isDeleteConfirmation = computed(() => {
    return !!props.itemName;
  });

  const handleCancel = () => {
    emit("cancel");
  };

  const handleConfirm = () => {
    emit("confirm");
  };
</script>

<style>
  .delete-confirmation {
    text-align: center;
    padding: 1rem 0;
  }

  .delete-question {
    font-size: 1rem;
    color: #333;
    margin: 0 0 10px;
    text-align: left;
    line-height: 1.5;
  }

  .delete-question strong {
    font-weight: 600;
    color: #000;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .cancel-btn.p-button {
    min-width: 120px !important;
    height: 44px !important;
    border-radius: 22px !important;
    background-color: transparent !important;
    border: 1px solid #9b9b9b !important;
    color: #9b9b9b !important;
    font:
      600 13px/1 "Roboto",
      sans-serif !important;
    letter-spacing: 0.5px !important;
    text-transform: uppercase !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    padding: 0 24px !important;
  }

  .cancel-btn.p-button:hover {
    background-color: rgba(155, 155, 155, 0.1) !important;
    border-color: #9b9b9b !important;
  }

  .cancel-btn .p-button-label {
    color: #9b9b9b !important;
  }

  .confirm-btn.p-button {
    min-width: 140px !important;
    height: 44px !important;
    border-radius: 22px !important;
    background-color: #dc3545 !important;
    color: white !important;
    border: none !important;
    font:
      600 13px/1 "Roboto",
      sans-serif !important;
    letter-spacing: 0.5px !important;
    text-transform: uppercase !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    padding: 0 20px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
  }

  .confirm-btn.p-button:hover {
    background-color: #c82333 !important;
    border-color: #c82333 !important;
  }

  .confirm-btn .p-button-label {
    color: white !important;
  }

  @media (max-width: 768px) {
    .action-buttons {
      flex-direction: column;
      gap: 0.75rem;
    }

    .cancel-btn,
    .confirm-btn {
      width: 100%;
    }
  }
</style>
