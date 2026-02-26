import { defineNuxtConfig } from "nuxt/config";
import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  css: [
    "~/../node_modules/primeicons/primeicons.css",
    "~/assets/styles/fonts.css",
    "~/assets/styles/variables.css",
  ],

  modules: ["@primevue/nuxt-module"],

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
          cssLayer: false,
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
