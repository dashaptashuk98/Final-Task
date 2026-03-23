import { fileURLToPath } from "node:url";
import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "coverage/**",
        "dist/**",
        "packages/*/test{,s}/**",
        "**/*.d.ts",
        "cypress/**",
        "test{,s}/**",
        "test{,-*}.{js,cjs,mjs,ts,tsx,jsx}",
        "**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}",
        "**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}",
        "**/__tests__/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
        "**/.{eslint,mocha,prettier}rc.{js,cjs,yml}",
        "nuxt.config.{js,ts}",
        "app.vue",
        "error.vue",
        ".nuxt/**",
        "server/**",
        "public/**",
      ],
      include: [
        "app/components/**/*.{js,ts,vue}",
        "app/composables/**/*.{js,ts}",
        "app/utils/**/*.{js,ts}",
        "app/pages/**/*.{js,ts,vue}",
      ],
    },
    name: "unit",
    include: ["test/unit/*.{test,spec}.ts"],
    environment: "nuxt",
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL(".", import.meta.url)),
        domEnvironment: "happy-dom",
        overrides: {
          modules: [],
          apollo: {
            clients: {
              default: {
                httpEndpoint: "http://localhost:4000/graphql",
              },
            },
          },
        },
      },
    },
  },
});
