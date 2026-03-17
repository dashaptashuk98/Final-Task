<template>
  <HeaderComponent />
</template>

<script setup>
  definePageMeta({
    middleware: "auth",
    layout: "default",
  });
</script>

<style scoped></style>
