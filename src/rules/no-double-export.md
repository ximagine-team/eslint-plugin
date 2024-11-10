# no-double-export

Disallow having both named export and default export of the same identifier.

✅ This rule is _enabled_ in the `recommended` [config](https://github.com/ximagine-ai/eslint-plugin#configs).

📋 This rule belongs to the `import-export` [category](../../README.md#import-export).

<!-- end auto-generated rule header -->
<!-- Do not manually modify this header. Run: `pnpm run gen:docs` -->

## Rule Details

This rule prevents exporting the same identifier as both a named export and a default export in the same file. This helps maintain a consistent import pattern of the identifier.

### ❌ Incorrect

```ts
export function userProfile() {
  return null;
}
export default userProfile;
// or
export const config = { api: "url" };
export default config;
// or
export type UserData = { name: string };
export default UserData;
```

### ✅ Correct

```ts
// Use only default export
function userProfile() {
  return null;
}
export default userProfile;
// Or use only named export
export function userProfile() {
  return null;
}
// Different identifiers are fine
export const foo = "test";
export default bar;
```
