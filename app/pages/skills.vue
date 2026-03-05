<template>
  <div />
</template>

<script setup lang="ts">
  const router = useRouter();

  onMounted(() => {
    router.push("/posts/users/[userID]/skills");
  });
</script>
