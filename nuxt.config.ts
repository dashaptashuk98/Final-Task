import { defineNuxtConfig } from "nuxt/config";
import Aura from "@primeuix/themes/aura";

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
      ripple: true,
    },
  },

  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  devtools: { enabled: true },
});
