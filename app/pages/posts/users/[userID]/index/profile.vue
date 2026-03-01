<script setup lang="ts">
  import { useUsersStore } from "~/stores/users";
  import type { InputType } from "~~/types/types";
  import type { ProfileForm } from "~~/types/user";
  const store = useUsersStore();
  const route = useRoute();

  const userId = ref<string>(route.params.userID as string);
  const profileFormData = computed<Record<ProfileForm, InputType> | null>(() => {
    const formData: Record<ProfileForm, InputType> = {
      firstName: {
        key: "firstName",
        label: "First Name",
        value: store.user?.profile.first_name as string,
        type: "InputText",
      },
      lastName: {
        key: "lastName",
        label: "Last Name",
        value: store.user?.profile.last_name as string,
        type: "InputText",
      },
      department: {
        key: "department",
        label: "Department",
        value: store.user?.department_name as string,
        type: "Select",
        values: store.departments?.map((item) => {
          return { name: item.name };
        }),
      },
      position: {
        key: "position",
        label: "Position",
        value: store.user?.position_name as string,
        type: "Select",
        values: store.positions?.map((item) => {
          return { name: item.name };
        }),
      },
    };
    return store.user ? formData : null;
  });
  await store.fetchDepartments();
  await store.fetchPositions();
  await store.fetchUser(userId.value);
</script>

<template>
  <section v-if="store.user" class="profile">
    <div class="profile-avatar">
      <Avatar
        :image="store.user ? (store.user.profile.avatar as string) : undefined"
        :label="store.user && store.user.profile.avatar ? undefined : store.user.email[0]"
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
      <h2 class="profile-data__title">{{ store.user?.profile.full_name }}</h2>
      <a href="mailto:#" class="profile-data__email">{{ store.user?.email }}</a>
      <p class="profile-data__member">{{ store.user?.created_at }}</p>
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
