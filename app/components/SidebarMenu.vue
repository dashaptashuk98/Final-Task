<template>
  <Panel class="sidebar sidebar--left">
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
  </Panel>
</template>

<script setup lang="ts">
  import Panel from "primevue/panel";
  import IconSkills from "~/components/IconSkills.vue";

  import { useRoute } from "vue-router";

  const route = useRoute();

  interface MenuItem {
    icon?: string;
    name: string;
    title: string;
    to: string;
    isActive: boolean;
  }

  const baseMenuItems = [
    {
      icon: "pi pi-users",
      name: "employees",
      title: "Employees",
      to: "/employees",
    },
    {
      name: "skills",
      title: "Skills",
      to: "/skills",
    },
    {
      icon: "pi pi-language",
      name: "languages",
      title: "Languages",
      to: "/languages",
    },
    {
      icon: "pi pi-file",
      name: "cvs",
      title: "CVs",
      to: "/cvs",
    },
  ];

  const menuItems = computed<MenuItem[]>(() =>
    baseMenuItems.map((item) => ({
      ...item,
      isActive: route.path === item.to,
    })),
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
    z-index: 1000;
  }

  .sidebar--left :deep(.p-panel-header) {
    display: none;
  }

  .sidebar--left :deep(.p-panel-content) {
    padding: 1rem 0;
    border: none;
    background: transparent;
  }

  .sidebar__icons {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .sidebar__item {
    display: block;
    text-decoration: none;
    border-bottom-right-radius: 200px;
    border-top-right-radius: 200px;
    transition: all 0.2s ease;
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

    .sidebar__text {
      display: none;
    }

    .sidebar__item-content {
      justify-content: center;
      padding: 0.75rem 0;
    }

    .sidebar__icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .sidebar__icon :deep(svg) {
      width: 28px;
      height: 16px;
    }
  }
</style>
