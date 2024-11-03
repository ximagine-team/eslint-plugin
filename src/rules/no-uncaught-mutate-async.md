# no-uncaught-mutate-async

Enforce wrapping React Query mutateAsync calls in try-catch blocks to ensure proper error handling.

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
