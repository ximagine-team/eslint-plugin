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
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
      },
    },
  ],
});
