<template>
  <Breadcrumb :home="null" :model="items">
    <template #separator>/</template>
    <template #item="{ item, props }">
      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a :href="href" v-bind="props.action" @click="navigate">
          <span class="breadcrumb-label">{{ item.label }}</span>
        </a>
      </router-link>
      <span v-else v-bind="props.action">
        <span class="breadcrumb-label">{{ item.label }}</span>
      </span>
    </template>
  </Breadcrumb>
</template>

<script setup>
  import { ref } from "vue";
  import { useRoute } from "vue-router";

  const route = useRoute();

  const items = ref([]);
  watch(
    () => route.path,
    (newPath) => {
      if (newPath === "/users" || newPath.startsWith("/users/")) {
        items.value = [{ label: "Employee", route: "/users" }];
      } else if (newPath === "/skills") {
        items.value = [{ label: "Skills", route: "/skills" }];
      } else if (newPath === "/languages") {
        items.value = [{ label: "Languages", route: "/languages" }];
      } else if (newPath === "/cvs") {
        items.value = [{ label: "Cvs", route: "/cvs" }];
      } else {
        items.value = [];
      }
    },
    { immediate: true },
  );
</script>

<style scoped>
  .breadcrumb-label {
    color: rgba(0, 0, 0, 0.6);
    font-family: "Roboto";
    font-size: 16px;
  }

  :deep(.p-breadcrumb) {
    background: transparent;
    border: none;
    padding: 0;
    margin: 0 0 20px 0;
  }

  :deep(.p-breadcrumb-list) {
    padding: 0 !important;
    margin: 0 0 10px !important;
  }

  :deep(.p-breadcrumb-home) {
    display: none !important;
  }

  :deep(.p-breadcrumb-separator) {
    color: rgba(0, 0, 0, 0.6);
    margin: 0 8px;
  }
</style>
