import { unindent as $ } from "eslint-vitest-rule-tester";

import { runTest } from "../utils/run-test";
import rule, { RULE_NAME } from "./enforce-request-prefix";

runTest({
  name: RULE_NAME,
  rule,
  valid: [
    // Correctly prefixed hooks
    "const requestGetAllPosts = api.post.getAll.useQuery()",
    "const requestCreatePost = api.post.create.useMutation()",
    "const requestInfinitePosts = api.post.infinite.useInfiniteQuery()",
    "const requestUpdatePost = useMutation({ mutationFn: (data) => axios.post('/update', data) })",
    // Non-React Query variables
    "const normalVariable = 'test'",
    "const result = someFunction()",
    // Valid usage of prefixed variables
    $`
      const requestGetPosts = api.post.getAll.useQuery();
      console.log(requestGetPosts.data);
    `,
  ],
  invalid: [
    {
      code: "const getAllPosts = api.post.getAll.useQuery()",
      output: "const requestGetAllPosts = api.post.getAll.useQuery()",
      errors: [{ messageId: "enforceRequestPrefix" }],
    },
    {
      code: "const createPost = api.post.create.useMutation()",
      output: "const requestCreatePost = api.post.create.useMutation()",
      errors: [{ messageId: "enforceRequestPrefix" }],
    },
    {
      code: "const infinitePosts = api.post.infinite.useInfiniteQuery()",
      output:
        "const requestInfinitePosts = api.post.infinite.useInfiniteQuery()",
      errors: [{ messageId: "enforceRequestPrefix" }],
    },
    {
      code: $`
        const updatePost = useMutation({
          mutationFn: (data) => axios.post("/update", data)
        })
      `,
      output: $`
        const requestUpdatePost = useMutation({
          mutationFn: (data) => axios.post("/update", data)
        })
      `,
      errors: [{ messageId: "enforceRequestPrefix" }],
    },
    // Test cases for variable references
    {
      code: $`
        const getPosts = api.post.getAll.useQuery();
        console.log(getPosts.data);
        if (getPosts.isLoading) return null;
      `,
      output: $`
        const requestGetPosts = api.post.getAll.useQuery();
        console.log(requestGetPosts.data);
        if (requestGetPosts.isLoading) return null;
      `,
      errors: [{ messageId: "enforceRequestPrefix" }],
    },
    {
      code: $`
        const createPost = api.post.create.useMutation();
        createPost.mutate(data);
        if (createPost.isLoading) return null;
      `,
      output: $`
        const requestCreatePost = api.post.create.useMutation();
        requestCreatePost.mutate(data);
        if (requestCreatePost.isLoading) return null;
      `,
      errors: [{ messageId: "enforceRequestPrefix" }],
    },
    {
      code: $`
        const { data, isLoading } = api.post.getAll.useQuery();
      `,
      output: $`
        const { data, isLoading } = api.post.getAll.useQuery();
      `,
      errors: [{ messageId: "enforceRequestPrefixDestructured" }],
    },
  ],
});
