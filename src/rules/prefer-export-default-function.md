# prefer-export-default-function

Prefer 'export default function' over separate export default.

✅ This rule is _enabled_ in the `recommended` [config](https://github.com/ximagine-ai/eslint-plugin#configs).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

📋 This rule belongs to the `code-style` [category](../../README.md#code-style).

<!-- end auto-generated rule header -->
<!-- Do not manually modify this header. Run: `pnpm run gen:docs` -->

## Rule Details

This rule enforces using the `export default function` syntax when exporting a function as the default export.

### ❌ Incorrect

```ts
function foo() {
  return 42;
}

export default foo;
```

### ✅ Correct

```ts
export default function foo() {
  return 42;
}
```
