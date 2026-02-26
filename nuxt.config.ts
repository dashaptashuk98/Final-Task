import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css", "~/../node_modules/primeicons/primeicons.css"],
  modules: [
    "@nuxt/test-utils/module",
    "@nuxt/eslint",
    [
      "@vee-validate/nuxt",
      {
        autoImports: true,
        componentNames: {
          Form: "VeeForm",
          Field: "VeeField",
          FieldArray: "VeeFieldArray",
          ErrorMessage: "VeeErrorMessage",
        },
      },
    ],
    [
      "@primevue/nuxt-module",
      {
        unstyled: true,
        autoImport: true,
      },
    ],
    "@nuxt/test-utils/module",
  ],
  devtools: { enabled: true },
});
