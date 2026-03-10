<script setup lang="ts">
  import { ref, computed, watch } from "vue";
  import type { ProfileForm } from "~/types/user";
  import type { InputType } from "~/types/types";
  import { updateUserMutation } from "~/graphQL/user/userUpdate.mutation";
  import { updateProfileMutation } from "~/graphQL/user/userProfileUpdate.mutation";
  import { useUsers } from "~/composables/useUsers";

  const props = defineProps<{
    data: Record<ProfileForm, InputType> | null;
    userId?: string;
  }>();
  const { user, departments, positions } = useUsers();
  const { authUser } = useAuth();

  const formData = ref<Record<ProfileForm, InputType> | null>(null);
  const initialData = ref<Record<ProfileForm, InputType> | null>(null);
  const loading = ref(false);

  watch(
    () => props.data,
    (newData) => {
      if (newData) {
        formData.value = JSON.parse(JSON.stringify(newData));
        initialData.value = JSON.parse(JSON.stringify(newData));
      }
    },
    { immediate: true, deep: true },
  );

  const hasChanges = computed(() => {
    if (!formData.value || !initialData.value) return false;
    return JSON.stringify(formData.value) !== JSON.stringify(initialData.value);
  });

  const handleUpdate = async () => {
    if (!formData.value || !user.value || !hasChanges.value) return;

    try {
      loading.value = true;
      const { $apollo } = useNuxtApp();

      const departmentId = departments.value?.find(
        (d) => d.name === formData.value!.department.value,
      )?.id;
      const positionId = positions.value?.find(
        (p) => p.name === formData.value!.position.value,
      )?.id;

      const userResponse = await $apollo.clients.default.mutate({
        mutation: updateUserMutation,
        variables: {
          user: {
            userId: user.value.id,
            departmentId: departmentId || null,
            positionId: positionId || null,
          },
        },
      });

      const profileResponse = await $apollo.clients.default.mutate({
        mutation: updateProfileMutation,
        variables: {
          profile: {
            userId: user.value.id,
            first_name: formData.value.firstName.value as string,
            last_name: formData.value.lastName.value as string,
          },
        },
      });

      if (userResponse?.data?.updateUser) {
        Object.assign(user.value, userResponse.data.updateUser);
      }

      if (profileResponse?.data?.updateProfile) {
        if (user.value) {
          user.value.profile = profileResponse.data.updateProfile;
        }
      }

      initialData.value = JSON.parse(JSON.stringify(formData.value));
    } catch {
      // игнорим
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div class="form">
    <Form>
      <div class="form-input-wrapper">
        <template v-for="item in formData" :key="item.key">
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
              option-value="name"
              :pt="{
                optionLabel: { style: { font: '400 16px/32px Roboto, sans-serif' } },
                list: { style: { backgroundColor: '#FFFFFF' } },
              }" />
          </div>
        </template>
      </div>
      <Button
        :label="'Update'.toLocaleUpperCase()"
        :disabled="!hasChanges || loading || authUser?.id !== props.userId"
        :loading="loading"
        @click="handleUpdate" />
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
    border: 1px solid #0000003b;
    padding: 0 10px;
  }

  :deep(.p-inputtext),
  :deep(.p-select-label) {
    font:
      400 24px/46px "Roboto",
      sans-serif;
  }

  .p-button {
    width: 410px;
    height: 48px;
    background-color: #3c39391f;
    border-radius: 40px;
    border: none;
    font:
      500 14px/24px "Roboto",
      sans-serif;
    color: white;
    letter-spacing: 0.4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .p-button:hover:not(:disabled) {
    background-color: #767a7f;
  }

  .p-button:disabled {
    background-color: #0000001f;
    color: #00000042;
    cursor: not-allowed;
  }
</style>
