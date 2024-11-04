# prefer-one-line-arrow-function

Prefer one-line arrow function expressions over block body when function only has a single return statement.

✅ This rule is _enabled_ in the `recommended` [config](https://github.com/ximagine-ai/eslint-plugin#configs).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->
<!-- Do not manually modify this header. Run: `pnpm run gen:docs` -->

## Rule Details

This rule suggests simplifying arrow functions to one-line for simplicity and conciseness.

### ❌ Incorrect

```ts
const fn = () => {
  return 42;
};
const fn = (a: number): number => {
  return a + 42;
};
const fn = async () => {
  return Promise.resolve(42);
};
```

### ✅ Correct

```ts
const fn = () => 42;
const fn = (a: number): number => a + 42;
const fn = async () => Promise.resolve(42);
```
