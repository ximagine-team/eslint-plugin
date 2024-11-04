# enforce-request-prefix

Enforce request prefix for React Query hooks.

✅ This rule is _enabled_ in the `recommended` [config](https://github.com/ximagine-ai/eslint-plugin#configs).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->
<!-- Do not manually modify this header. Run: `pnpm run gen:docs` -->

## Rule Details

This rule enforces that all React Query hooks (useQuery, useMutation, useInfiniteQuery) should be assigned to a request-prefixed variable.

### ❌ Incorrect

```ts
// Vanilla usage
const createPost = useMutation({
  mutationFn: (data) => axios.post("/post", data),
});

// tRPC usage
const getAllPosts = api.post.getAll.useQuery();

const updatePost = api.post.update.useMutation();

// Direct destructuring is not allowed
const { data, isLoading } = api.post.getAll.useQuery();
```

### ✅ Correct

```ts
const requestGetAllPosts = api.post.getAll.useQuery();

const requestCreatePost = useMutation({
  mutationFn: (data) => axios.post("/post", data),
});

const requestUpdatePost = api.post.update.useMutation();
```
