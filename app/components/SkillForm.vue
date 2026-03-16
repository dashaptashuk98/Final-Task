<template>
  <div class="form">
    <Form>
      <div class="form-input-wrapper" :class="{ 'two-columns': twoColumns }">
        <template v-for="item in data" :key="item.key">
          <div class="form-input-container">
            <label :for="item.key" class="form-input-container__label">{{ item.label }}</label>
            <InputText
              v-if="item.type === 'InputText'"
              :id="item.key"
              v-model="item.value as string"
              class="custom-input" />
            <Select
              v-else-if="item.type === 'Select'"
              v-model="item.value"
              :options="item.values"
              :disabled="action === 'Update' && (item.key === 'language' || item.key === 'skill')"
              option-label="name"
              option-value="name"
              class="custom-select"
              :pt="{
                optionLabel: { style: { font: '400 16px/32px Roboto, sans-serif' } },
                list: { style: { backgroundColor: '#FFFFFF' } },
              }" />
          </div>
        </template>
        <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
      </div>
      <div class="form-actions">
        <Button type="button" label="Cancel" severity="secondary" @click="$emit('cancel')" />
        <Button
          type="button"
          label="Confirm"
          :disabled="disabled"
          @click="data && $emit('save', data, action as string)" />
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, InputType>">
  import type { InputType } from "~/types/types";
  import Select from "primevue/select";
  import InputText from "primevue/inputtext";

  const {
    data,
    action = "Add",
    errorMessage = "",
    twoColumns = false,
    disabled = false,
  } = defineProps<{
    data: T | null;
    action?: string;
    errorMessage?: string;
    twoColumns?: boolean;
    disabled?: boolean;
  }>();

  defineEmits<{
    cancel: [];
    save: [data: T, type: string];
  }>();
</script>

<style scoped>
  .form {
    padding: 0;
  }

  .p-form {
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
    max-width: 852px;
  }

  .form-input-wrapper {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 32px;
  }

  .form-input-wrapper.two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    width: 100%;
  }

  .form-input-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
  }

  .form-input-container__label {
    position: absolute;
    top: -8px;
    left: 12px;
    background-color: white;
    padding: 0 4px;
    font:
      400 12px/16px "Roboto",
      sans-serif;
    letter-spacing: 0.15px;
    color: #00000099;
    z-index: 1;
  }

  .custom-select,
  .custom-input,
  .custom-datepicker {
    width: 410px;
    height: 48px;
    font:
      400 16px/24px "Roboto",
      sans-serif;
    border: 1px solid #0000003b;
    border-radius: 4px;
    padding: 12px 12px 0 12px;
    transition: border-color 0.2s;
  }

  .custom-select:hover,
  .custom-input:hover,
  .custom-datepicker:hover {
    border-color: #00000099;
  }

  .custom-select:focus,
  .custom-input:focus,
  .custom-datepicker:focus {
    outline: none;
    border-color: #c63031;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }

  .form-actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    width: 100%;
  }

  .p-button {
    width: 450px;
    height: 48px;
    border-radius: 40px;
    font:
      500 14px/24px "Roboto",
      sans-serif;
    letter-spacing: 0.4px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .p-button:not(.p-button-secondary) {
    background-color: #c63031;
    color: white;
    border: none;
  }

  .p-button:not(.p-button-secondary):hover:not(:disabled) {
    background-color: #c63031;
  }

  .p-button:not(.p-button-secondary):disabled {
    background-color: #0000001f;
    color: #00000042;
    cursor: not-allowed;
  }

  .p-button.p-button-secondary {
    background-color: transparent;
    border: 1px solid #0000003b;
    color: #00000099;
  }

  .p-button.p-button-secondary:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  :deep(.p-message) {
    font: 400 16px/24px "Roboto";
    letter-spacing: 0.15px;
    color: #c63031;
    outline: 0;
  }
</style>
