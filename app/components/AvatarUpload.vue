<template>
  <div
    class="avatar-upload"
    @dragover.prevent
    @dragenter.prevent="isDragging = true"
    @dragleave="handleDragLeave"
    @drop="handleDrop">
    <Avatar
      :image="user.profile?.avatar ?? undefined"
      :label="!user.profile?.avatar ? user.email[0] : undefined"
      shape="circle"
      class="avatar-clickable"
      :class="{ 'drag-over': isDragging }"
      @click="openFileDialog" />

    <input
      ref="fileInput"
      type="file"
      accept=".png,.jpg,.jpeg,.gif"
      style="display: none"
      @change="handleFileSelect" >

    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="uploading" class="uploading">Uploading...</div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { uploadAvatarMutation } from "~/graphQL/user/userUpload.mutation";

  interface Props {
    user: {
      id: string;
      email: string;
      profile?: {
        avatar?: string;
      };
    };
    disabled?: boolean;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    avatarUpdated: [avatar: string];
  }>();

  const fileInput = ref<HTMLInputElement>();
  const isDragging = ref(false);
  const uploading = ref(false);
  const error = ref<string | null>(null);

  const openFileDialog = () => {
    if (props.disabled) return;
    fileInput.value?.click();
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 500 * 1024;
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

    if (file.size > maxSize) {
      error.value = "File size must not exceed 500 KB";
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      error.value = "Only PNG, JPG, JPEG, GIF formats are supported";
      return false;
    }

    return true;
  };

  const uploadAvatar = async (file: File) => {
    if (props.disabled || !validateFile(file)) return;

    uploading.value = true;
    error.value = null;

    try {
      const { $apollo } = useNuxtApp();
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const response = await $apollo.clients.default.mutate({
        mutation: uploadAvatarMutation,
        variables: {
          avatar: {
            userId: String(props.user.id),
            base64,
            size: file.size,
            type: file.type,
          },
        },
      });

      if (response?.data?.uploadAvatar) {
        emit("avatarUpdated", response.data.uploadAvatar);
      }
    } catch (err) {
      if (err instanceof Error && err.message?.includes("Must supply api_key")) {
        error.value = "An error occurred, please try again later";
      } else {
        error.value = "File upload error";
      }
    } finally {
      uploading.value = false;
    }
  };

  const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const handleDragLeave = (event: DragEvent) => {
    const currentTarget = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as Node | null;
    if (!currentTarget?.contains(relatedTarget)) {
      isDragging.value = false;
    }
  };
</script>

<style scoped>
  .avatar-upload {
    position: relative;
  }

  .avatar-clickable {
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid transparent;
  }

  .avatar-clickable:hover {
    opacity: 0.8;
  }

  .avatar-clickable.drag-over {
    border-color: #007bff;
    transform: scale(1.05);
  }

  .error-message {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  .uploading {
    color: #007bff;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
</style>
