<script setup lang="ts">
  import type { Cv } from "~/types/cvs";
  import type { Nullable } from "~/types/types";

  definePageMeta({
    middleware: "auth",
    layout: "default",
  });
  const { fetchCv, updateCv } = useCvs();
  const route = useRoute();
  const cv = useState<Nullable<Cv>>(() => null);
  cv.value = await fetchCv(route.params.cvId as string);
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
  <section class="cv-details">
    <CvForm
      :data="formData"
      :user-id="userId"
      :cv-id="cv ? cv.id : null"
      @submit-cv="(id, data) => updateCv(Object.assign({ cvId: id }, data))" />
  </section>
</template>

<style scoped>
  .cv-details {
    padding-top: 32px;
  }
</style>
