<template>
  <div class="users-page">
    <div v-if="usersStore.loading" class="loading-container">Загрузка пользователей...</div>
    <div v-else>
      <DataTable
        :value="displayUsers"
        paginator
        :rows="10"
        :rows-per-page-options="[5, 10, 25, 50]"
        table-style="min-width: 70rem"
        striped-rows
        sort-mode="single"
        class="custom-table"
        paginator-template="PageLinks RowsPerPageDropdown">
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

        <Column field="firstName" header="First Name" sortable />
        <Column field="lastName" header="Last Name" sortable />
        <Column field="email" header="Email" sortable />

        <Column field="department" sortable>
          <template #header>
            <div class="department-header">
              <span>Department</span>
              <i class="pi pi-arrow-up department-sort-icon" />
            </div>
          </template>
        </Column>

        <Column field="position" header="Position" sortable />

        <Column header-style="width: 5rem">
          <template #header> <span /> </template>
          <template #body="{ data }">
            <Button
              v-if="data.email === authStore.user?.email"
              icon="pi pi-ellipsis-v"
              class="action-button"
              text
              rounded
              severity="secondary" />
            <Button
              v-else
              icon="pi pi-angle-right"
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useUsersStore } from "~~/stores/users";
  import { useAuthStore } from "~~/stores/auth";
  import { ref, onMounted, watch } from "vue";
  import type { UserUI } from "~~/types/user";

  const usersStore = useUsersStore();
  const authStore = useAuthStore();

  const displayUsers = ref<UserUI[]>([]);

  const getInitial = (email: string): string => {
    if (!email) return "?";
    return email.charAt(0).toUpperCase();
  };
  const sortUsers = () => {
    const users = [...usersStore.users] as UserUI[];
    const currentUserEmail = authStore.user?.email;

    if (!users.length) {
      displayUsers.value = [];
      return;
    }

    if (!currentUserEmail) {
      displayUsers.value = users;
      return;
    }

    const currentUser = users.find((u) => u.email === currentUserEmail);

    if (!currentUser) {
      displayUsers.value = users;
      return;
    }
    const otherUsers = users.filter((u) => u.email !== currentUserEmail);
    displayUsers.value = [currentUser as UserUI, ...otherUsers];
  };

  watch(
    () => [usersStore.users, authStore.user],
    () => sortUsers(),
    { deep: true },
  );

  onMounted(async () => {
    authStore.reloadUser();
    await usersStore.fetchUsers();
    sortUsers();
  });
</script>

<style scoped>
  .users-page {
    padding: 20px;
    font-family: "Roboto", sans-serif;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    font-size: 16px;
    color: #666;
  }

  :deep(.custom-table) {
    border-collapse: collapse;
  }

  :deep(.custom-table .p-datatable-thead > tr > th) {
    padding: 16px 16px;
    background-color: white;
    border-bottom: 1px solid #e0e0e0;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: #2e2e2e;
    white-space: nowrap;
  }

  :deep(.custom-table .p-datatable-tbody > tr) {
    height: 73px;
  }

  :deep(.custom-table .p-datatable-tbody > tr > td) {
    padding: 8px 16px;
    border-bottom: 1px solid #e0e0e0;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #2e2e2e;
    vertical-align: middle;
  }

  :deep(.p-paginator) {
    padding: 20px 0;
    background-color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    font-family: "Roboto", sans-serif;
    border-top: 1px solid #e0e0e0;
    margin-top: 16px;
  }

  :deep(.p-paginator .p-paginator-pages) {
    display: flex;
    gap: 8px;
  }

  :deep(.p-paginator .p-paginator-page) {
    min-width: 36px;
    height: 36px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #2e2e2e;
    background-color: transparent;
    transition: all 0.2s;
    margin: 0;
    border: none;
  }

  :deep(.p-paginator .p-paginator-page:hover) {
    background-color: #f0f0f0;
  }

  :deep(.p-datatable-paginator-bottom) {
    border-style: none;
  }

  :deep(.p-paginator .p-paginator-page.p-highlight) {
    background-color: #2e2e2e;
    color: white;
    font-weight: 500;
  }

  :deep(.p-paginator .p-paginator-first),
  :deep(.p-paginator .p-paginator-prev),
  :deep(.p-paginator .p-paginator-next),
  :deep(.p-paginator .p-paginator-last) {
    display: none;
  }

  :deep(.p-paginator .p-paginator-rpp-options) {
    min-width: 70px;
    height: 36px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    color: #2e2e2e;
    background-color: white;
    padding: 0 8px;
    cursor: pointer;
  }

  :deep(.p-paginator .p-paginator-rpp-options:hover) {
    border-color: #2e2e2e;
  }

  :deep(.p-paginator .p-paginator-current) {
    font-size: 14px;
    color: #666;
  }

  :deep(.p-icon) {
    display: none !important;
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
