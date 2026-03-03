import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: [
    "~/assets/css/main.css",
    "~/../node_modules/primeicons/primeicons.css",
    "~/assets/styles/fonts.css",
    "~/assets/styles/variables.css",
  ],
  modules: [
    "@nuxt/test-utils/module",
    "@nuxt/eslint",
    "nuxt-auth-utils",
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
    [
      "@primevue/nuxt-module",
      {
        unstyled: true,
        autoImport: true,
      },
    ],
    "@nuxt/test-utils/module",
    "@pinia/nuxt",
  ],
  devtools: { enabled: true },
});
