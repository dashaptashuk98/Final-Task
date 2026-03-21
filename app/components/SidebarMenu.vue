<template>
  <Panel class="sidebar sidebar--left">
    <div class="sidebar__content">
      <div class="sidebar__icons">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.to"
          class="sidebar__item"
          active-class="sidebar__item--active">
          <div class="sidebar__item-content">
            <IconSkills
              v-if="item.name === 'skills'"
              class="sidebar__icon"
              :color="item.isActive ? '#2E2E2E' : '#666'" />
            <i v-else :class="['sidebar__icon', item.icon]" />
            <span class="sidebar__text">{{ item.title }}</span>
          </div>
        </NuxtLink>
      </div>

      <div class="sidebar__bottom">
        <NuxtLink
          :to="authUser?.id ? `/users/${authUser.id}/profile` : '/'"
          class="sidebar__profile-link">
          <Avatar
            v-if="authUser && authUser.email[0]"
            :label="!authUser.profile.avatar ? authUser.email[0].toUpperCase() : undefined"
            :image="authUser.profile.avatar ? authUser.profile.avatar : undefined"
            shape="circle"
            class="sidebar__avatar" />
          <span class="sidebar__profile-name">{{
            authUser?.profile?.full_name || authUser?.email
          }}</span>
          <Button icon="pi pi-chevron-left" rounded @click="logout" />
        </NuxtLink>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
  import IconSkills from "~/components/IconSkills.vue";
  import { useAuth } from "~/composables/useAuth";
  import type { MenuItem } from "~/types/userTable";
  import { useRoute } from "vue-router";
  import { computed } from "vue";

  const { authUser, logout } = useAuth();

  const route = useRoute();

  const baseMenuItems = [
    {
      icon: "pi pi-users",
      name: "users",
      title: "Employees",
      to: "/users",
    },
    {
      icon: "pi pi-folder",
      name: "projects",
      title: "Projects",
      to: `/projects`,
    },
    {
      icon: "pi pi-file",
      name: "cvs",
      title: "CVs",
      to: "/cvs",
    },
    {
      icon: "pi pi-building-columns",
      name: "departments",
      title: "Departments",
      to: "/departments",
    },
    {
      icon: "pi pi-check-circle",
      name: "position",
      title: "Position",
      to: "/position",
    },
    {
      name: "skills",
      title: "Skills",
      to: `/skills`,
    },
    {
      icon: "pi pi-language",
      name: "languages",
      title: "Languages",
      to: `/languages`,
    },
  ];

  const menuItems = computed<MenuItem[]>(() =>
    baseMenuItems.map((item) => {
      let isActive = false;

      if (item.name === "skills") {
        isActive = route.path.endsWith("/skills") || route.path.includes("/skills");
      } else if (item.name === "users") {
        isActive = route.path === "/users";
      } else {
        isActive = route.path === item.to;
      }

      return {
        ...item,
        isActive,
      };
    }),
  );
</script>

<style scoped>
  .sidebar--left {
    width: 200px;
    min-height: 100vh;
    background: var(--sidebar-bg);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
  }

  .sidebar--left :deep(.p-panel-header) {
    display: none;
  }

  .sidebar--left :deep(.p-panel-content) {
    padding: 0;
    border: none;
    background: transparent;
    height: 100vh;
  }

  .sidebar__content {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 1rem 0;
    width: 200px;
  }

  .sidebar__icons {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    width: 200px;
  }

  .sidebar__bottom {
    margin-top: auto;
    padding: 16px;
    border-top: 1px solid #e0e0e0;
    width: 100%;
    max-width: 200px;
  }

  .sidebar__profile-link {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: #2e2e2e;
    font-family: "Roboto", sans-serif;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s ease;
    width: 100%;
    max-width: 168px;
  }

  .sidebar__avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
  }

  .sidebar__avatar :deep(.p-avatar) {
    width: 40px;
    height: 40px;
  }

  .sidebar__profile-name {
    flex: 1;
    min-width: 0;
    word-break: break-word;
    white-space: nowrap;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar__profile-link:hover {
    color: #000;
  }

  .sidebar__item {
    display: block;
    text-decoration: none;
    border-bottom-right-radius: 200px;
    border-top-right-radius: 200px;
    transition: all 0.2s ease;
    width: 200px;
  }

  .sidebar__item:hover {
    background-color: var(--sidebar-item-hover-bg);
  }

  .sidebar__item--active {
    background-color: var(--sidebar-item-active-bg);
  }

  .sidebar__item:hover .sidebar__icon,
  .sidebar__item--active .sidebar__icon {
    filter: brightness(0) saturate(100%) invert(8%) sepia(0%) saturate(0%) brightness(0.2);
    opacity: 1;
  }

  .sidebar__item:hover .sidebar__text,
  .sidebar__item--active .sidebar__text {
    color: #2e2e2e;
  }

  .sidebar__item-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    width: 200px;
  }

  .sidebar__icon {
    font-size: 24px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    opacity: 0.7;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .sidebar__icon :deep(svg) {
    width: 24px;
    height: 14px;
  }

  .sidebar__text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 16px;
    font-weight: 400;
    font-family: "Roboto", sans-serif;
    line-height: 24px;
    white-space: nowrap;
    transition: color 0.2s ease;
  }

  .sidebar__item:hover .sidebar__icon {
    transform: scale(1.1);
  }

  @media (max-width: 1024px) {
    .sidebar--left {
      width: 200px;
    }
  }

  @media (max-width: 768px) {
    .sidebar--left {
      width: 60px;
    }

    .sidebar__content {
      width: 60px;
    }

    .sidebar__icons {
      width: 60px;
    }

    .sidebar__item {
      width: 60px;
    }

    .sidebar__item-content {
      width: 60px;
      justify-content: center;
      padding: 0.75rem 0;
    }

    .sidebar__text {
      display: none;
    }

    .sidebar__icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      flex-shrink: 0;
    }

    .sidebar__icon :deep(svg) {
      width: 28px;
      height: 16px;
    }

    .sidebar__bottom {
      width: 60px;
      padding: 12px 8px;
    }

    .sidebar__profile-name {
      display: none;
    }
  }
</style>
