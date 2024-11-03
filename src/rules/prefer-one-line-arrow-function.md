# prefer-one-line-arrow-function

Prefer one-line arrow function expressions over block body when function only has a single return statement.

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

This rule is fixable - it will automatically convert arrow functions with a single return statement to use expression syntax.
