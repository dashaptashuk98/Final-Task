<template>
  <div>
    <AppLoader :visible="visible" />
    <NuxtLayout>
      <NuxtPage />
      <Toast />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  const { isLoading } = useLoadingIndicator();
  const isMounted = ref(false);
  const visible = computed(() => !isMounted.value || isLoading.value);

  onMounted(() => {
    isMounted.value = true;
  });
</script>

<style>
  .p-toast {
    font-family: "Roboto", sans-serif;
  }

  .p-toast-message {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 1rem;
  }

  .p-toast-message-success {
    background-color: #d4edda;
    border: 1px solid #28a745;
    color: #155724;
  }

  .p-toast-message-success .p-toast-message-icon {
    color: #28a745;
  }

  .p-toast-message-success .p-toast-summary {
    color: #155724;
    font-weight: 600;
  }

  .p-toast-message-success .p-toast-detail {
    color: #155724;
  }

  .p-toast-message-error {
    background-color: #fee9e7;
    border: 1px solid #c63031;
    color: #721c24;
  }

  .p-toast-message-error .p-toast-message-icon {
    color: #c63031;
  }

  .p-toast-message-error .p-toast-summary {
    color: #721c24;
    font-weight: 600;
  }

  .p-toast-message-error .p-toast-detail {
    color: #721c24;
  }

  .p-toast-message-warn {
    background-color: #fff3cd;
    border: 1px solid #ffc107;
    color: #856404;
  }

  .p-toast-message-warn .p-toast-message-icon {
    color: #ffc107;
  }

  .p-toast-message-warn .p-toast-summary {
    color: #856404;
    font-weight: 600;
  }

  .p-toast-message-warn .p-toast-detail {
    color: #856404;
  }

  .p-toast-message-info {
    background-color: #d1ecf1;
    border: 1px solid #17a2b8;
    color: #0c5460;
  }

  .p-toast-message-info .p-toast-message-icon {
    color: #17a2b8;
  }

  .p-toast-message-info .p-toast-summary {
    color: #0c5460;
    font-weight: 600;
  }

  .p-toast-message-info .p-toast-detail {
    color: #0c5460;
  }

  .p-toast-message-content .p-toast-icon-close {
    color: inherit;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .p-toast-message-content .p-toast-icon-close:hover {
    opacity: 1;
  }
</style>
