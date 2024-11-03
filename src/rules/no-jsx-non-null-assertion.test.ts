import { unindent as $ } from "eslint-vitest-rule-tester";

import { runTest } from "../utils/run-test";
import rule, { RULE_NAME } from "./no-jsx-non-null-assertion";

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
    // Regular JSX without non-null assertions
    "<div>{user.name}</div>",
    "<UserProfile data={user} />",
    // Using optional chaining
    "<div>{user?.name}</div>",
    "<div>{user?.profile?.email}</div>",
    // Using intermediate variables
    $`
      const userName = user!.name;
      <div>{userName}</div>
    `,
    // Non-JSX non-null assertions (allowed)
    "const name = user!.name",
    "function getName() { return user!.name }",
  ],
  invalid: [
    {
      code: "<div>{user!.name}</div>",
      errors: [{ messageId: "noJsxNonNullAssertion" }],
    },
    {
      code: "<UserProfile data={user!} />",
      errors: [{ messageId: "noJsxNonNullAssertion" }],
    },
    {
      code: "<div title={props.title!}>Content</div>",
      errors: [{ messageId: "noJsxNonNullAssertion" }],
    },
    {
      code: "<div>{user!.profile!.email}</div>",
      errors: [
        { messageId: "noJsxNonNullAssertion" },
        { messageId: "noJsxNonNullAssertion" },
      ],
    },
    {
      code: "<Component {...props!} />",
      errors: [{ messageId: "noJsxNonNullAssertion" }],
    },
  ],
});
