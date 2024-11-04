# ESLint Plugin

## Installation

```bash
pnpm dlx jsr add -D @ximagine/eslint-plugin
```

## Usage

```javascript
import { defineConfig } from "@ximagine/eslint-config";
import ximagine from "@ximagine/eslint-plugin";

export default defineConfig({
  globals: {
    presets: ["nodeBuiltin"],
  },
  configs: (p) => [p.js, p.ts, p.vitest, ximagine.configs.recommended],
});
```

## Rules

<!-- Do not manually modify this list. Run: `pnpm run gen:docs` -->
<!-- begin auto-generated rules list -->

✅ Set in the `recommended` [configuration](https://github.com/ximagine-ai/eslint-plugin#configs).
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name | Description | 💼 | 🔧 |
| :--- | :---------- | :- | :- |
| [enforce-request-prefix](src/rules/enforce-request-prefix.md) | Enforce request prefix for React Query hooks | ✅ | 🔧 |
| [function-params-destructuring](src/rules/function-params-destructuring.md) | Enforce destructuring function parameters in the function body | ✅ | 🔧 |
| [no-jsx-non-null-assertion](src/rules/no-jsx-non-null-assertion.md) | Disallow non-null assertions (!) in JSX expressions | ✅ |  |
| [no-uncaught-mutate-async](src/rules/no-uncaught-mutate-async.md) | Enforce wrapping React Query mutateAsync calls in try-catch blocks | ✅ |  |
| [no-unsafe-type-assertion](src/rules/no-unsafe-type-assertion.md) | Disallow type assertions through unknown/any without documentation | ✅ |  |
| [no-void-mutate-async](src/rules/no-void-mutate-async.md) | Disallow using void operator with React Query mutateAsync calls | ✅ | 🔧 |
| [prefer-one-line-arrow-function](src/rules/prefer-one-line-arrow-function.md) | Prefer one-line arrow function expressions over block body when function only has a single return statement | ✅ | 🔧 |

<!-- end auto-generated rules list -->
