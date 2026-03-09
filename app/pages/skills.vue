<template>
  <div />
</template>

<script setup lang="ts">
  import { useAuth } from "~/composables/useAuth";

  const router = useRouter();
  const { authUser } = useAuth();

  onMounted(() => {
    if (authUser.value?.id) {
      router.push(`/users/${authUser.value.id}/skills`);
    }
  });
</script>
