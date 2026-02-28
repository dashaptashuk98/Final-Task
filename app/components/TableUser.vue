<template>
  <div class="users-page">
    <DataTable
      :value="users"
      :loading="loading"
      paginator
      :rows="10"
      :rows-per-page-options="[5, 10, 25, 50]"
      table-style="min-width: 70rem"
      striped-rows
      sort-mode="single">
      <Column header-style="width: 4rem">
        <template #body="{ data }">
          <div class="avatar-container">
            <img v-if="data.avatar" :src="data.avatar" :alt="data.email" class="avatar-image" >
            <div v-else class="avatar-placeholder">
              {{ getInitial(data.email) }}
            </div>
          </div>
        </template>
      </Column>

      <Column field="firstName" sortable>
        <template #header>
          <span>First Name</span>
        </template>
      </Column>

      <Column field="lastName" sortable>
        <template #header>
          <span>Last Name</span>
        </template>
      </Column>

      <Column field="email" sortable>
        <template #header>
          <span>Email</span>
        </template>
      </Column>

      <Column field="department" sortable>
        <template #header>
          <div class="department-header">
            <span>Department</span>
            <i class="pi pi-arrow-up department-sort-icon" />
          </div>
        </template>
      </Column>

      <Column field="position" sortable>
        <template #header>
          <span>Position</span>
        </template>
      </Column>

      <Column header-style="width: 5rem">
        <template #header> <span /> </template>
        <template #body>
          <Button
            icon="pi pi-angle-right"
            class="action-button"
            text
            rounded
            severity="secondary" />
          <Button
            v-if="auth"
            icon="pi pi-ellipsis-v"
            class="action-button"
            text
            rounded
            severity="secondary" />
        </template>
      </Column>

      <template #empty>
        <div class="text-center p-4">Нет данных для отображения</div>
      </template>
    </DataTable>
    <div v-if="loading" class="loading"><i class="pi pi-spin pi-spinner" /> Загрузка...</div>

    <div v-else class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { getUsers } from "../../server/services/users";
  import type { User } from "../../types/user";

  const users = ref<User[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const auth = ref<boolean>(false);

  const getInitial = (email: string): string => {
    if (!email) return "?";
    return email.charAt(0).toUpperCase();
  };

  const loadUsers = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getUsers();
      users.value = Array.isArray(response) ? response : response.data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Ошибка загрузки данных";
    } finally {
      loading.value = false;
    }
  };

  loadUsers();
</script>

<style scoped>
  .users-page {
    padding: 20px;
  }

  span {
    font-family: "Roboto";
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: #2e2e2e;
  }

  tr > td {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;

    color: #2e2e2e;
  }

  .loading,
  .error {
    padding: 40px;
    text-align: center;
    font-size: 16px;
  }

  .error {
    color: #e74c3c;
  }

  .avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
  }

  .avatar-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #3498db;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 18px;
  }

  :deep(.p-icon) {
    display: none !important;
  }

  .department-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .department-sort-icon {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    opacity: 0.7;
  }

  .action-button {
    width: 32px;
    height: 32px;
  }
</style>
