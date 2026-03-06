<template>
  <div class="users-page">
    <div v-if="loading" class="loading-container">Загрузка пользователей...</div>
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
              <img
                v-if="data.profile?.avatar"
                :src="data.profile.avatar"
                :alt="data.email"
                class="avatar-image" >
              <div v-else class="avatar-placeholder">
                {{ getInitial(data.email) }}
              </div>
            </div>
          </template>
        </Column>

        <Column field="profile.first_name" header="First Name" sortable>
          <template #body="{ data }">
            {{ data.profile?.first_name || "-" }}
          </template>
        </Column>

        <Column field="profile.last_name" header="Last Name" sortable>
          <template #body="{ data }">
            {{ data.profile?.last_name || "-" }}
          </template>
        </Column>

        <Column field="email" header="Email" sortable />

        <Column field="department.name" sortable>
          <template #header>
            <div class="department-header">
              <span>Department</span>
              <i class="pi pi-arrow-up department-sort-icon" />
            </div>
          </template>
          <template #body="{ data }">
            {{ data.department?.name || "-" }}
          </template>
        </Column>

        <Column field="position.name" header="Position" sortable>
          <template #body="{ data }">
            {{ data.position?.name || "-" }}
          </template>
        </Column>

        <Column header-style="width: 5rem">
          <template #header> <span /> </template>
          <template #body="{ data }">
            <Button
              v-if="data.email === currentUserEmail"
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
  import { ref, onMounted, watch, computed } from "vue";
  import { useUsers } from "~/composables/useUsers";
  import { useAuth } from "~/composables/useAuth";
  import type { User } from "~/types/user";

  const { users, loading, fetchUsers } = useUsers();
  const { authUser } = useAuth();

  const displayUsers = ref<User[]>([]);

  const currentUserEmail = computed(() => authUser.value?.email);

  const getInitial = (email: string): string => {
    if (!email) return "?";
    return email.charAt(0).toUpperCase();
  };

  const sortUsers = () => {
    const usersList: User[] = users.value;
    const email = currentUserEmail.value;

    if (!usersList.length) {
      displayUsers.value = [];
      return;
    }

    if (!email) {
      displayUsers.value = usersList;
      return;
    }

    const currentUserInList = usersList.find((u) => u.email === email);

    if (!currentUserInList) {
      displayUsers.value = usersList;
      return;
    }

    const otherUsers = usersList.filter((u) => u.email !== email);
    displayUsers.value = [currentUserInList as User, ...otherUsers];
  };

  watch([users, authUser], () => sortUsers(), { deep: true });

  await fetchUsers();

  onMounted(async () => {
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
