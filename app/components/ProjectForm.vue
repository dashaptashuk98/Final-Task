<template>
  <div class="form">
    <Form>
      <div class="form-input-wrapper" :class="{ 'two-columns': twoColumns }">
        <template v-for="item in data" :key="item.key">
          <div
            class="form-input-container"
            :class="{
              'full-width': ['description', 'environment', 'responsibilities'].includes(item.key),
            }">
            <label :for="item.key" class="form-input-container__label">{{ item.label }}</label>
            <InputText
              v-if="item.type === 'InputText'"
              :id="item.key"
              v-model="item.value as string"
              :disabled="!checkRights(userId) && item.key === 'responsibilies'"
              class="custom-input"
              :pt="{
                root: { style: { overflowX: 'auto', whiteSpace: 'nowrap' } },
              }" />

            <Select
              v-else-if="item.type === 'Select'"
              v-model="item.value"
              :options="item.values"
              class="custom-select"
              :disabled="!checkRights(userId)"
              :pt="{
                optionLabel: { style: { font: '400 16px/32px Roboto, sans-serif' } },
                list: { style: { backgroundColor: '#FFFFFF' } },
              }" />
            <DatePicker
              v-else-if="item.type === 'DatePicker'"
              :id="item.key"
              v-model="item.value as Date"
              date-format="yy-mm-dd"
              show-icon
              :disabled="!checkRights()"
              fluid
              :show-on-focus="false"
              :pt="{
                panel: {
                  style: {
                    '--p-datepicker-panel-background': '#ffffff',
                    '--p-datepicker-panel-border-color': '#0000003b',
                    '--p-datepicker-date-hover-background': '#2e2e2e10',
                    'border-radius': '5px',
                    'margin-top': '1px',
                    'font-family': 'Roboto',
                  },
                },
                dayCell: { style: { padding: '5px 0' } },
                header: {
                  style: {
                    '--p-datepicker-header-padding': '15px',
                    '--p-datepicker-title-font-weight': '600',
                    '--p-datepicker-title-gap': '10px',
                  },
                },
              }"
              class="custom-datepicker" />
            <Textarea
              v-else-if="item.type === 'Textarea'"
              :id="item.key"
              v-model="item.value as string"
              rows="3"
              :disabled="!checkRights()"
              auto-resize
              class="custom-textarea" />
            <MultiSelect
              v-else-if="item.type === 'MultiSelect'"
              v-model="item.value"
              :options="item.values"
              show-clear
              display="chip"
              :disabled="!checkRights()"
              class="custom-multiselect"
              :pt="{
                optionLabel: { style: { font: '400 16px/32px Roboto, sans-serif' } },
                option: { style: { gap: '10px', padding: '0 10px' } },
                overlay: { style: { border: '1px #2e2e2e50 solid' } },
                list: { style: { backgroundColor: '#FFFFFF' } },
              }" />
          </div>
        </template>
      </div>
      <div class="form-actions">
        <Button type="button" label="Cancel" severity="secondary" @click="$emit('cancel')" />
        <Button type="button" :label="action" @click="data && $emit('save', data)" />
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
  import type { InputType, ProjectFormKey } from "~/types/types";
  const {
    data,
    twoColumns = false,
    action = "Add",
    userId = "",
  } = defineProps<{
    data: Record<ProjectFormKey, InputType> | null;
    twoColumns?: boolean;
    action?: string;
    userId?: string;
  }>();

  defineEmits<{
    cancel: [];
    save: [data: Record<ProjectFormKey, InputType>];
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    width: 100%;
  }

  .form-input-container.full-width {
    grid-column: 1 / -1;
  }

  .form-input-container.f {
    grid-column: 1 / -1;
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
  :deep(.p-inputtext) {
    overflow-x: auto;
    white-space: nowrap;
  }

  .custom-multiselect {
    width: 100%;
    min-height: 48px;
    display: flex;
    gap: 10px;
    font:
      400 16px/24px "Roboto",
      sans-serif;
    border: 1px solid #0000003b;
    border-radius: 4px;
    padding: 8px 12px;
    transition: border-color 0.2s;
  }

  .custom-multiselect:hover {
    border-color: #00000099;
  }

  .custom-multiselect:focus {
    outline: none;
    border-color: #c63031;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }

  :deep(.p-multiselect-label) {
    flex-wrap: wrap;
  }

  .custom-textarea {
    width: 100%;
    min-height: 80px;
    font:
      400 16px/24px "Roboto",
      sans-serif;
    border: 1px solid #0000003b;
    border-radius: 4px;
    padding: 12px;
    transition: border-color 0.2s;
    resize: vertical;
  }

  .custom-textarea:hover {
    border-color: #00000099;
  }

  .custom-textarea:focus {
    outline: none;
    border-color: #c63031;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }

  .custom-select,
  .custom-input,
  .custom-datepicker {
    width: 100%;
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

  .custom-multiselect :deep(.p-chip) {
    background-color: #c6303199;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 40px;
    margin: 2px;
    gap: 8px;
  }

  .custom-multiselect :deep(.p-chip-label) {
    color: white;
  }
  .form-actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
  }

  .p-button {
    width: 200px;
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
</style>
