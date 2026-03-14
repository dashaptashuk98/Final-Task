<script setup lang="ts">
  import type { Cv } from "~/types/cvs";
  import type { Nullable } from "~/types/types";

  const { data, userId, cvId } = defineProps<{
    data: Nullable<Pick<Cv, "name" | "education" | "description">>;
    userId: Nullable<string>;
    cvId: Nullable<string>;
  }>();
  const emit = defineEmits<{
    (event: "updateCv", data: Pick<Cv, "name" | "education" | "description">, id: string): void;
  }>();
  const { authId } = useAuth();
  const formData = ref<Pick<Cv, "name" | "education" | "description">>({
    name: "",
    education: "",
    description: "",
  });

  watchEffect(() => {
    if (data) {
      formData.value = { ...data };
    }
  });
</script>

<template>
  <Form>
    <div class="form-input-container">
      <label class="form-input-container__label">Name</label>
      <InputText :id="formData ? formData.name : ''" v-model="formData.name" />
    </div>
    <div class="form-input-container">
      <label class="form-input-container__label">Education</label>
      <InputText
        :id="formData ? (formData.education as string) : ''"
        v-model="formData.education" />
    </div>
    <div class="form-input-container">
      <label class="form-input-container__label">Description</label>
      <Textarea :id="formData ? formData.description : ''" v-model="formData.description" />
    </div>
    <Button
      label="UPDATE"
      :disabled="String(authId) !== userId"
      @click="emit('updateCv', formData, cvId as string)" />
  </Form>
</template>

<style scoped>
  .form {
    margin-top: 65px;
  }

  .p-form {
    margin: 0 auto;
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 32px;
    max-width: 852px;
  }

  .form-input-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .form-input-container__label {
    font:
      400 12px/16px "Roboto",
      sans-serif;
    letter-spacing: 0.15px;
    color: #00000099;
  }

  :deep(.p-inputtext),
  :deep(.p-textarea) {
    width: 100%;
    border: 1px solid #0000003b;
    padding: 0 10px;
  }
  :deep(.p-inputtext) {
    font:
      400 24px/46px "Roboto",
      sans-serif;
  }
  :deep(.p-textarea) {
    font:
      400 16px/23px "Roboto",
      sans-serif;
    letter-spacing: 0.15px;
    padding: 10px;
  }

  .p-button {
    width: 410px;
    height: 48px;
    background-color: #b52b2b;
    border-radius: 40px;
    font:
      500 14px/24px "Roboto",
      sans-serif;
    color: #ffffff;
    letter-spacing: 0.4px;
  }

  .p-button:hover:not(:disabled) {
    background-color: #b52b2b;
    color: #000000;
  }

  .p-button:disabled {
    background-color: #0000001f;
    color: #00000042;
  }

  :deep(.p-button-label) {
    font: 400 14px/24px "Roboto";
    letter-spacing: 0.4px;
  }
</style>
