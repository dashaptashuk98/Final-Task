<template>
  <div class="users">
    <CvsSheet
      :columns
      :sheet-data="users"
      :context-menu="contextMenuOptions"
      :user-id="String(authId)"
      button-label="Create user"
      page="users"
      @handle-selected-item="(user) => (selectedRow = user)"
      @activate-form="activateModal" />
    <ModalDialog v-model:visible="isVisible" :header="modalHeader" width="900px">
      <SkillForm
        :data="formData"
        :action="modalHeader"
        @cancel="() => (isVisible = false)"
        @save="submitForm" />
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
  import { useDepartments } from "~/composables/useDepartments";
  import type { Department } from "~/types/departments";
  import type { Position } from "~/types/positions";
  import type { InputType, MenuData, Nullable, sheetColumn } from "~/types/types";
  import type {
    CreateUserInput,
    UpdateProfileInput,
    UpdateUserInput,
    User,
    UserFormKeys,
    UserRole,
  } from "~/types/user";
  definePageMeta({
    layout: "default",
    middleware: "auth",
  });
  const { fetchDepartments } = useDepartments();
  const { users, fetchUsers, deleteUser, updateUser, createUser, updateProfile } = useUsers();
  const { fetchPositions } = usePositions();
  const { authId } = useAuth();
  const isVisible = ref<boolean>(false);
  const selectedRow = ref<Nullable<User>>(null);
  const modalHeader = ref<string>("");
  const departments = ref<Nullable<Department[]>>([]);
  const positions = ref<Nullable<Position[]>>([]);
  departments.value = await fetchDepartments();
  positions.value = await fetchPositions();
  await fetchUsers();
  const columns = ref<sheetColumn[]>([
    { field: "profile.avatar" },
    { field: "profile.first_name", header: "First name" },
    { field: "profile.last_name", header: "Last name" },
    { field: "email", header: "Email" },
    { field: "department.name", header: "Department" },
    { field: "position.name", header: "Position" },
  ]);
  const formData = computed<Record<UserFormKeys, InputType>>(() => ({
    email: {
      key: "email",
      label: "email",
      value: selectedRow.value?.email ?? "",
      type: "InputText",
      values: [],
      disabled: !checkRights() || modalHeader.value === "Update user",
    },
    password: {
      key: "password",
      label: "Password",
      value: modalHeader.value === "Update user" ? "********" : "",
      type: "InputText",
      values: [],
      disabled: !checkRights() || modalHeader.value === "Update user",
    },
    first_name: {
      key: "firstName",
      label: "First name",
      value: selectedRow.value?.profile.first_name ?? "",
      type: "InputText",
      values: [],
    },
    last_name: {
      key: "lastName",
      label: "Last name",
      value: selectedRow.value?.profile.last_name ?? "",
      type: "InputText",
      values: [],
    },
    department: {
      key: "department",
      label: "Department",
      value: selectedRow.value?.department?.name ?? "",
      type: "Select",
      values: departments.value?.map((item) => ({ name: item.name })) ?? [],
    },
    position: {
      key: "position",
      label: "Position",
      value: selectedRow.value?.position?.name ?? "",
      type: "Select",
      values: positions.value?.map((item) => ({ name: item.name })) ?? [],
    },
    role: {
      key: "role",
      label: "Role",
      value: selectedRow.value?.role ?? "",
      type: "Select",
      values: [{ name: "Employee" }, { name: "Admin" }],
      disabled: !checkRights(),
    },
  }));

  const activateModal = (header: string): void => {
    if (header === "Create user") {
      selectedRow.value = null;
    }
    isVisible.value = true;
    modalHeader.value = header;
  };

  const submitForm = async (data: Record<UserFormKeys, InputType>): Promise<void> => {
    if (modalHeader.value === "Update user") {
      await handleUpdateUser(data);
    }
    if (modalHeader.value === "Create user") {
      await handleCreateUser(data);
    }
    await handleFormConfirmation();
  };

  const handleFormConfirmation = async (): Promise<void> => {
    if (users.value) {
      await fetchUsers();
    }
    isVisible.value = false;
  };

  const handleUpdateUser = async (data: Record<UserFormKeys, InputType>): Promise<void> => {
    if (selectedRow.value) {
      const mutateUserVars: UpdateUserInput = {
        userId: Number(selectedRow.value.id),
        cvsIds: selectedRow.value.cvs?.map((item) => item.id) as string[],
        departmentId: Number(
          departments.value?.find((item) => item.name === data.department.value)?.id,
        ),
        positionId: Number(positions.value?.find((item) => item.name === data.position.value)?.id),
        role: data.role.value as UserRole,
      };
      const mutateProfileVars: UpdateProfileInput = {
        userId: Number(selectedRow.value.id),
        first_name: data.first_name.value as string,
        last_name: data.last_name.value as string,
      };
      await updateProfile(mutateProfileVars);
      await updateUser(mutateUserVars);
    }
  };

  const handleCreateUser = async (data: Record<UserFormKeys, InputType>): Promise<void> => {
    const mutateUserVars: CreateUserInput = {
      auth: {
        email: data.email.value as string,
        password: data.password.value as string,
      },
      profile: {
        first_name: data.first_name.value as string,
        last_name: data.last_name.value as string,
      },
      cvsIds: [],
      departmentId: Number(
        departments.value?.find((item) => item.name === data.department.value)?.id,
      ),
      positionId: Number(positions.value?.find((item) => item.name === data.position.value)?.id),
      role: data.role.value as UserRole,
    };
    await createUser(mutateUserVars);
  };

  const handleDeleteUser = async (id: string): Promise<void> => {
    await deleteUser(id);
    handleFormConfirmation();
  };

  const contextMenuOptions = ref<MenuData[]>([
    {
      label: "Update user",
      command: () => activateModal("Update user"),
    },
    {
      label: "Delete user",
      command: () => (selectedRow.value ? handleDeleteUser(selectedRow.value.id) : null),
    },
  ]);
</script>

<style scoped>
  .users {
    padding: 0 20px;
  }
</style>
