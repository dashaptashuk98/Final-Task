<template>
  <Transition name="fade">
    <div v-if="visible" class="loader-overlay">
      <div class="loader-spinner" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
  defineProps<{ visible: boolean }>();
</script>

<style scoped>
  .loader-overlay {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
  }

  .loader-spinner {
    width: 56px;
    height: 56px;
    border: 4px solid #e0e0e0;
    border-top-color: #c63031;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
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
