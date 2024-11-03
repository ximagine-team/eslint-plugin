# no-unsafe-type-assertion

Enforce safe type assertions by disallowing `as unknown as` or `as any as` patterns unless properly documented.

## Rule Details

This rule prevents unsafe type assertions through `unknown` or `any` intermediaries unless there's a comment explaining why it's necessary in the line above.

### ❌ Incorrect

```ts
const value = someValue as unknown as TargetType;
const data = response as any as UserData;

// Random comment that is not on the line immediately before the assertion
const config = rawConfig as unknown as Config;
```

### ✅ Correct

```ts
// Need to cast through unknown because the source type is from an external library
const value = someValue as unknown as TargetType;

// API response type is dynamic and needs force casting
const data = response as any as UserData;

// Direct assertion when types are compatible
const config = rawConfig as Config;
```
