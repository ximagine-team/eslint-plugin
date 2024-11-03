# no-void-mutate-async

Disallow using void operator with React Query mutateAsync calls.

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
