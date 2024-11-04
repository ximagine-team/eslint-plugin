# no-uncaught-mutate-async

Enforce wrapping React Query mutateAsync calls in try-catch blocks.

✅ This rule is _enabled_ in the `recommended` [config](https://github.com/ximagine-ai/eslint-plugin#configs).

<!-- end auto-generated rule header -->
<!-- Do not manually modify this header. Run: `pnpm run gen:docs` -->

## Rule Details

Errors thrown from `mutateAsync` calls will not automatically be caught and will become unhandled errors.

This rule enforces that all `mutateAsync` calls from React Query are wrapped in try-catch blocks for proper error handling.

### ❌ Incorrect

```ts
await user.mutateAsync(data);
const result = await user.mutateAsync(data);
someFunction(await user.mutateAsync(data));
```

### ✅ Correct

```ts
try {
  await user.mutateAsync(data);
} catch (error) {
  console.error(error);
}

try {
  const result = await user.mutateAsync(data);
} catch (error) {
  console.error(error);
}

try {
  someFunction(await user.mutateAsync(data));
} catch (error) {
  console.error(error);
}
```
