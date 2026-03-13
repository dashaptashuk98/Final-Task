<template>
  <Dialog
    v-model:visible="isVisible"
    :header="header"
    :style="{ width: '450px' }"
    modal
    :closable="true"
    :draggable="false"
    :dismissable-mask="true">
    <slot />
  </Dialog>
</template>

<script setup lang="ts">
  interface Props {
    visible: boolean;
    header: string;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    "update:visible": [value: boolean];
  }>();

  const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit("update:visible", value),
  });
</script>
