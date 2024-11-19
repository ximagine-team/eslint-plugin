import { defineConfig } from "@ximagine/eslint-config";

export default defineConfig({
  globals: {
    presets: ["nodeBuiltin"],
  },
  configs: (p) => [
    p.js,
    p.ts,
    p.vitest,
    {
      rules: {
        "unicorn/consistent-function-scoping": "off",
      },
    },
  ],
});
