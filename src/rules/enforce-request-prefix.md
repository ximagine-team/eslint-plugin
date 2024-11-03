# enforce-request-prefix

Enforce request prefix for React Query hooks.

## Rule Details

This rule enforces that all React Query hooks (useQuery, useMutation, useInfiniteQuery) should be prefixed with 'request'.

### ❌ Incorrect

```ts
const getAllPosts = api.post.getAll.useQuery();

const createPost = useMutation({
  mutationFn: (data) => axios.post("/post", data),
});

const updatePost = api.post.update.useMutation();
```

### ✅ Correct

```ts
const requestGetAllPosts = api.post.getAll.useQuery();

const requestCreatePost = useMutation({
  mutationFn: (data) => axios.post("/post", data),
});

const requestUpdatePost = api.post.update.useMutation();
```
