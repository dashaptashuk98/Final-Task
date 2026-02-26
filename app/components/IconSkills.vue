<template>
  <svg
    :width="size"
    :height="size === 24 ? 14 : 12"
    viewBox="0 0 20 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 0L16.29 2.29L11.41 7.17L7.41 3.17L0 10.59L1.41 12L7.41 6L11.41 10L17.71 3.71L20 6V0H14Z"
      :fill="color" />
  </svg>
</template>

<script setup lang="ts">
  interface IconAttr {
    size?: number;
    color?: string;
  }

  withDefaults(defineProps<IconAttr>(), {
    size: 24,
    color: "#666",
  });
</script>
