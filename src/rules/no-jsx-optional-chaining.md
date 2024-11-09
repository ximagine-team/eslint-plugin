# no-jsx-optional-chaining

Disallow optional chaining (?.) in JSX expressions.

✅ This rule is _enabled_ in the `recommended` [config](https://github.com/ximagine-ai/eslint-plugin#configs).

📋 This rule belongs to the `best-practice` [category](../../README.md#best-practice).

<!-- end auto-generated rule header -->
<!-- Do not manually modify this header. Run: `pnpm run gen:docs` -->

## Rule Details

This rule prevents using optional chaining (`?.`) in JSX expressions. Instead, use intermediate variable and handle null/undefined before rendering.

### ❌ Incorrect

```tsx
// Using optional chaining directly in JSX
<div>{user?.name}</div>
```

### ✅ Correct

```tsx
// Handle null check before JSX
const userName = user?.name ?? 'Anonymous'
<div>{userName}</div>
```
