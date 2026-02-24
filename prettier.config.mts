import type { Config } from "prettier";

const config: Config = {
  trailingComma: "all",
  tabWidth: 2,
  printWidth: 100,
  semi: true,
  singleQuote: false,
  bracketSpacing: true,
  objectWrap: "preserve",
  bracketSameLine: true,
  arrowParens: "always",
  htmlWhitespaceSensitivity: "css",
  vueIndentScriptAndStyle: true,
  singleAttributePerLine: false,
};

export default config;
