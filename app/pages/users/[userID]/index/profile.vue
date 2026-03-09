<script setup lang="ts">
  import { useUsers } from "~/composables/useUsers";
  import type { InputType } from "~/types/types";
  import type { ProfileForm } from "~/types/user";

  definePageMeta({
    middleware: "auth",
  });

  const { user, departments, positions, fetchUser, fetchDepartments, fetchPositions } = useUsers();

  const route = useRoute();
  const userId = ref<string>(route.params.userID as string);

  const profileFormData = computed<Record<ProfileForm, InputType> | null>(() => {
    if (!user.value) return null;

    const formData: Record<ProfileForm, InputType> = {
      firstName: {
        key: "firstName",
        label: "First Name",
        value: user.value?.profile?.first_name ?? "",
        type: "InputText",
      },
      lastName: {
        key: "lastName",
        label: "Last Name",
        value: user.value?.profile?.last_name ?? "",
        type: "InputText",
      },
      department: {
        key: "department",
        label: "Department",
        value: user.value?.department_name ?? "",
        type: "Select",
        values: departments.value?.map((item) => {
          return { name: item.name };
        }),
      },
      position: {
        key: "position",
        label: "Position",
        value: user.value?.position_name ?? "",
        type: "Select",
        values: positions.value?.map((item) => {
          return { name: item.name };
        }),
      },
    };

    return formData;
  });

  await fetchDepartments();
  await fetchPositions();
  await fetchUser(userId.value);
</script>

<template>
  <section v-if="user" class="profile">
    <div class="profile-avatar">
      <Avatar
        :image="user.profile?.avatar ?? undefined"
        :label="!user.profile?.avatar ? user.email[0] : undefined"
        shape="circle" />
      <div class="profile-avatar__container">
        <div class="profile-avatar__container-info">
          <span class="pi pi-upload" style="font-size: 32px; color: #2e2e2e; height: 32px" />
          <h3 class="profile-avatar__container-title">Upload avatar image</h3>
        </div>
        <p class="profile-avatar__container-description">png, jpg or gif no more than 0.5MB</p>
      </div>
    </div>
    <div class="profile-data">
      <h2 class="profile-data__title">{{ user.profile?.full_name }}</h2>
      <a :href="`mailto:${user.email}`" class="profile-data__email">{{ user.email }}</a>
      <p class="profile-data__member">{{ user.created_at }}</p>
    </div>
    <ProfileForm :data="profileFormData" />
  </section>
</template>

<style scoped>
  .profile {
    margin: 0 auto;
    margin-top: 32px;
    max-width: 900px;
  }

  .profile-avatar {
    display: flex;
    justify-content: center;
    gap: 50px;
    text-align: center;
    align-items: center;
  }

  .profile-avatar__container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  :deep(.p-avatar),
  :deep(.p-avatar-label) {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  :deep(.p-avatar-label) {
    display: flex;
    justify-content: center;
    align-items: center;
    font:
      400 40px/47px "Roboto",
      sans-serif;
    color: #f5f5f7;
    background-color: #bdbdbd;
  }

  .profile-avatar__container-info {
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  .profile-avatar__container-title,
  .profile-avatar__container-description {
    margin: 0;
    letter-spacing: 0.15px;
    color: #2e2e2e;
  }

  .profile-avatar__container-title {
    font:
      500 20px/32px "Roboto",
      sans-serif;
  }

  .profile-avatar__container-description {
    font:
      400 16px/28px "Roboto",
      sans-serif;
    opacity: 60%;
    padding-bottom: 21px;
  }

  .profile-data {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .profile-data__title {
    font:
      400 24px/32px "Roboto",
      sans-serif;
    margin: 0;
    margin-bottom: 10px;
    color: #2e2e2e;
  }

  .profile-data__email,
  .profile-data__member {
    font:
      400 16px/24px "Roboto",
      sans-serif;
    letter-spacing: 0.15px;
  }

  .profile-data__email {
    color: #00000099;
    text-decoration: none;
  }

  .profile-data__member {
    color: #2e2e2e;
    margin: 0;
  }
</style>
