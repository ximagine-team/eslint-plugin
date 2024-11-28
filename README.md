# ESLint Plugin

## Installation

```bash
pnpm dlx jsr add -D @ximagine/eslint-plugin
```

## Usage

```javascript
// eslint.config.js
import ximagine from "@ximagine/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  ximagine.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
  },
];
```

## Rules

<!-- Do not manually modify this list. Run: `pnpm run gen:docs` -->
<!-- begin auto-generated rules list -->

✅ Set in the `recommended` [configuration](https://github.com/ximagine-ai/eslint-plugin#configs).

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

### Best Practice

| Name                                                                              | Description                                                        | 💼  | 🔧  |
| :-------------------------------------------------------------------------------- | :----------------------------------------------------------------- | :-- | :-- |
| [no-jsx-non-null-assertion](src/rules/no-jsx-non-null-assertion.md)               | Disallow non-null assertions (!) in JSX expressions                | ✅  |     |
| [no-jsx-optional-chaining](src/rules/no-jsx-optional-chaining.md)                 | Disallow optional chaining (?.) in JSX expressions                 | ✅  |     |
| [no-unsafe-type-assertion](src/rules/no-unsafe-type-assertion.md)                 | Disallow type assertions through unknown/any without documentation | ✅  |     |
| [no-object-literal-type-assertion](src/rules/no-object-literal-type-assertion.md) | Disallow type assertions on object literals without documentation  | ✅  |     |

### Code Style

| Name                                                                          | Description                                                                       | 💼  | 🔧  |
| :---------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- | :-- | :-- |
| [function-params-destructuring](src/rules/function-params-destructuring.md)   | Enforce destructuring function parameters in the function body                    | ✅  | 🔧  |
| [padding-lines](src/rules/padding-lines.md)                                   | Enforce padding lines between class members, test functions and object properties | ✅  | 🔧  |
| [prefer-export-default-function](src/rules/prefer-export-default-function.md) | Prefer 'export default function' over separate export default                     | ✅  | 🔧  |

### Import Export

| Name                                              | Description                                                                 | 💼  | 🔧  |
| :------------------------------------------------ | :-------------------------------------------------------------------------- | :-- | :-- |
| [no-double-export](src/rules/no-double-export.md) | Disallow having both named export and default export of the same identifier | ✅  |     |

### React Query

| Name                                                              | Description                                                        | 💼  | 🔧  |
| :---------------------------------------------------------------- | :----------------------------------------------------------------- | :-- | :-- |
| [enforce-request-prefix](src/rules/enforce-request-prefix.md)     | Enforce request prefix for React Query hooks                       | ✅  | 🔧  |
| [no-uncaught-mutate-async](src/rules/no-uncaught-mutate-async.md) | Enforce wrapping React Query mutateAsync calls in try-catch blocks | ✅  |     |
| [no-void-mutate-async](src/rules/no-void-mutate-async.md)         | Disallow using void operator with React Query mutateAsync calls    | ✅  | 🔧  |

<!-- end auto-generated rules list -->
