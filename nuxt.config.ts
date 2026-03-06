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
    "@nuxtjs/apollo",
  ],
  apollo: {
    autoImports: true,
    authType: "Bearer",
    authHeader: "Authorization",
    tokenStorage: "cookie",
    proxyCookies: true,
    clients: {
      default: {
        httpEndpoint: import.meta.env.VITE_GRAPHQL_URL,
        httpLinkOptions: {
          credentials: "same-origin",
        },
        connectToDevTools: false,
        tokenName: "token",
        tokenStorage: "cookie",
        authType: "Bearer",
        authHeader: "Authorization",
      },
    },
  },
  devtools: { enabled: true },
});
