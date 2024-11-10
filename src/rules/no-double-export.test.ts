import { unindent as $ } from "eslint-vitest-rule-tester";

import { runTest } from "../utils/run-test";
import rule, { RULE_NAME } from "./no-double-export";

runTest({
  name: RULE_NAME,
  rule,
  valid: [
    // Single named export
    "export const foo = 'test'",
    // Single default export
    "export default function foo() {}",
    // Different identifiers
    $`
      export const foo = 'test';
      export default bar;
    `,
    // Multiple named exports
    $`
      export const foo = 1;
      export const bar = 2;
    `,
  ],
  invalid: [
    // Function with both exports
    {
      code: $`
        export function userProfile() { return null }
        export default userProfile;
      `,
      errors: [
        { messageId: "noDoubleExport", line: 1 },
        { messageId: "noDoubleExport", line: 2 }
      ],
    },
    // Variable with both exports
    {
      code: $`
        export const config = { api: 'url' };
        export default config;
      `,
      errors: [
        { messageId: "noDoubleExport", line: 1 },
        { messageId: "noDoubleExport", line: 2 }
      ],
    },
    // Type with both exports
    {
      code: $`
        export type UserData = { name: string };
        export default UserData;
      `,
      errors: [
        { messageId: "noDoubleExport", line: 1 },
        { messageId: "noDoubleExport", line: 2 }
      ],
    },
  ],
}); 