<script setup lang="ts">
  import type { Cv } from "~/types/cvs";
  import type { Nullable } from "~/types/types";

  definePageMeta({
    middleware: "auth",
  });
  const { fetchCv, cv } = useCvs();
  const route = useRoute();
  await fetchCv(route.params.cvId as string);
  const userId = ref<Nullable<string>>(cv.value?.user?.id ?? null);
  const formData = ref<Nullable<Pick<Cv, "name" | "education" | "description">>>(
    cv.value
      ? Object.assign(
          {},
          { name: cv.value.name, education: cv.value.education, description: cv.value.description },
        )
      : null,
  );
</script>

<template>
  <CvForm :data="formData" :user-id="userId" />
</template>
