import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "no-console": "warn",
    "no-nested-ternary": "error",
    "no-inline-comments": "warn",
  },
});
