<template>
  <Transition name="fade">
    <div v-if="visible" class="loader-overlay">
      <Lottie :data="loading" :width="120" :height="120" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import loading from "@/assets/animation/loading.json";
  defineProps<{ visible: boolean }>();
</script>

<style scoped>
  .loader-overlay {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
