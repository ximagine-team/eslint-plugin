# no-object-literal-type-assertion

Disallow type assertions on object literals without documentation.

✅ This rule is _enabled_ in the `recommended` [config](https://github.com/ximagine-ai/eslint-plugin#configs).

📋 This rule belongs to the `best-practice` [category](../../README.md#best-practice).

<!-- end auto-generated rule header -->
<!-- Do not manually modify this header. Run: `pnpm run gen:docs` -->

## Rule Details

This rule prevents type assertions on object literals unless there's a comment explaining why it's necessary in the line above.

### ❌ Incorrect

```ts
const config = {} as Config;

const user = { name: "John" } as User;

// Comment that is not on the line immediately before the assertion

const data = { id: 1 } as Data;
```

### ✅ Correct

```ts
// Have a comment explaining why the assertion is necessary
// Need to assert empty object as Config for initialization
const config = {} as Config;

// Object declaration with type
const data: Data = { id: 1 };
```
