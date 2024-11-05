# no-jsx-non-null-assertion

Disallow non-null assertions (!) in JSX expressions.

✅ This rule is _enabled_ in the `recommended` [config](https://github.com/ximagine-ai/eslint-plugin#configs).

📋 This rule belongs to the `best-practice` [category](../../README.md#best-practice).

<!-- end auto-generated rule header -->
<!-- Do not manually modify this header. Run: `pnpm run gen:docs` -->

## Rule Details

This rule prevents using non-null assertions (`!`) in JSX expressions to avoid potential runtime errors. Instead, handle null/undefined values before rendering JSX.

### ❌ Incorrect

```tsx
// Using ! assertion directly in JSX
<div>{user!.name}</div>
<UserProfile data={user!} />
<div title={props.title!}>Content</div>

// Nested assertions
<div>{user!.profile!.email}</div>
```

### ✅ Correct

```tsx
// Handle null check before JSX
const userName = user?.name ?? 'Anonymous'
<div>{userName}</div>

// Use optional chaining
<div>{user?.name}</div>

// Use default value
<div title={props.title ?? ''}>Content</div>

// Handle complex cases with intermediate variables
const userEmail = user?.profile?.email ?? 'No email'
<div>{userEmail}</div>
```
