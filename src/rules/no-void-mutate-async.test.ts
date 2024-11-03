import { runTest } from "../utils/run-test";
import rule, { RULE_NAME } from "./no-void-mutate-async";

const valids = [
  // Regular mutateAsync usage
  "await user.mutateAsync(data)",
  // void with other async operations
  "void Promise.resolve()",
  "void fetch('api')",
  // Regular mutate usage
  "void user.mutate(data)",
  "user.mutate(data)",
];

const invalids = [
  {
    code: "void user.mutateAsync(data)",
    output: "user.mutate(data)",
    errors: [{ messageId: "noVoidMutateAsync" }],
  },
  {
    code: "void await user.mutateAsync(data)",
    output: "user.mutate(data)",
    errors: [{ messageId: "noVoidMutateAsync" }],
  },
  {
    code: "void (await user.mutateAsync(data))",
    output: "user.mutate(data)",
    errors: [{ messageId: "noVoidMutateAsync" }],
  },
  {
    code: "void user.mutateAsync(data, options)",
    output: "user.mutate(data, options)",
    errors: [{ messageId: "noVoidMutateAsync" }],
  },
  {
    code: "void user.mutateAsync({ id: 1, name: 'test' })",
    output: "user.mutate({ id: 1, name: 'test' })",
    errors: [{ messageId: "noVoidMutateAsync" }],
  },
];

runTest({
  name: RULE_NAME,
  rule,
  valid: valids,
  invalid: invalids,
});
