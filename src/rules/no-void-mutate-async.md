# no-void-mutate-async

Disallow using void operator with React Query mutateAsync calls.

✅ This rule is _enabled_ in the `recommended` [config](https://github.com/ximagine-ai/eslint-plugin#configs).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

📋 This rule belongs to the `react-query` [category](../../README.md#react-query).

<!-- end auto-generated rule header -->
<!-- Do not manually modify this header. Run: `pnpm run gen:docs` -->

## Rule Details

Use `mutate` instead of `void mutateAsync`.

### ❌ Incorrect

```ts
void user.mutateAsync(data);
void (await user.mutateAsync(data));
```

### ✅ Correct

```ts
user.mutate(data);

// Or await the mutateAsync call
await user.mutateAsync(data);
```
