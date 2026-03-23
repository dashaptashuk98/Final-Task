<template>
  <div />
</template>

<script setup>
  definePageMeta({
    middleware: "auth",
  });
  await navigateTo("/users");
</script>
