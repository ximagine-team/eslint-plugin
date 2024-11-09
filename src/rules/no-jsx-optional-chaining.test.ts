import { unindent as $ } from "eslint-vitest-rule-tester";

import { runTest } from "../utils/run-test";
import rule, { RULE_NAME } from "./no-jsx-optional-chaining";

runTest({
  name: RULE_NAME,
  rule,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  valid: [
    // Regular JSX without optional chaining
    "<div>{user.name}</div>",
    "<UserProfile data={user} />",
    // Using intermediate variables
    $`
      const userName = user?.name;
      <div>{userName}</div>
    `,
    $`
      const userEmail = user?.profile?.email;
      <div>{userEmail}</div>
    `,
    // Non-JSX optional chaining (allowed)
    "const name = user?.name",
    "function getName() { return user?.name }",
  ],
  invalid: [
    {
      code: "<div>{user?.name}</div>",
      errors: [{ messageId: "noJsxOptionalChaining" }],
    },
    {
      code: "<UserProfile data={user?.data} />",
      errors: [{ messageId: "noJsxOptionalChaining" }],
    },
    {
      code: "<div title={props?.title}>Content</div>",
      errors: [{ messageId: "noJsxOptionalChaining" }],
    },
    {
      code: "<div>{user?.profile?.email}</div>",
      errors: [{ messageId: "noJsxOptionalChaining" }],
    },
    {
      code: "<Component {...props?.data} />",
      errors: [{ messageId: "noJsxOptionalChaining" }],
    },
  ],
});
