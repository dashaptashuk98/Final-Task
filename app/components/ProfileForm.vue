<script setup lang="ts">
  import type { ProfileForm } from "~~/types/user";
  import type { InputType } from "~~/types/types";

  const { data } = defineProps<{ data: Record<ProfileForm, InputType> | null }>();
</script>

<template>
  <div class="form">
    <Form>
      <div class="form-input-wrapper">
        <template v-for="item in data" :key="item.key">
          <div class="form-input-container">
            <label :for="item.key" class="form-input-container__label">{{ item.label }}</label>
            <InputText
              v-if="item.type === 'InputText'"
              :id="item.key"
              v-model="item.value as string" />
            <Select
              v-else-if="item.type === 'Select'"
              v-model="item.value"
              :options="item.values"
              option-label="name"
              option-value="name" />
          </div>
        </template>
      </div>
      <Button :label="'Update'.toLocaleUpperCase()" disabled />
    </Form>
  </div>
</template>

<style scoped>
  .form {
    margin-top: 65px;
  }

  .p-form {
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 32px;
    max-width: 852px;
  }

  .form-input-wrapper {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 32px;
  }

  .form-input-container {
    display: flex;
    flex-direction: column;
  }

  .form-input-container__label {
    font:
      400 12px/16px "Roboto",
      sans-serif;
    letter-spacing: 0.15px;
    color: #00000099;
  }

  :deep(.p-inputtext),
  .p-select {
    width: 410px;
    height: 48px;
    font:
      400 24px/40px "Roboto",
      sans-serif;
    border: 1px solid #0000003b;
    padding: 0 10px;
  }

  .p-button {
    width: 410px;
    height: 48px;
    background-color: #0000001f;
    border-radius: 40px;
    font:
      500 14px/24px "Roboto",
      sans-serif;
    color: #00000042;
    letter-spacing: 0.4px;
  }
</style>
