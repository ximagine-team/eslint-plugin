import { unindent as $ } from "eslint-vitest-rule-tester";

import { runTest } from "../utils/run-test";
import rule, { RULE_NAME } from "./no-object-literal-type-assertion";

runTest({
  name: RULE_NAME,
  rule,
  valid: [
    // With explanatory comment
    $`
      // Need to assert empty object as Config for initialization
      const config = {} as Config;
    `,
    $`
      // User type has additional runtime properties
      const user = { name: "John" } as User;
    `,
    // Not object literal assertions
    "const str = 'hello' as string",
    "const num = 42 as number",
    // Type annotations instead of assertions
    "const data: Data = { id: 1 }",
    "const config: Config = {}",
    // Multi-line comments
    $`
      /*
       * Complex type assertion needed because
       * the object is partially initialized
       */
      const state = {} as State;
    `,
    // Const assertions should not be reported
    "const config = {} as const;",
    "const user = { name: 'John', role: 'admin' } as const;",
    "const settings = { theme: 'dark', fontSize: 16 } as const;",
    $`
      const ROUTES = {
        HOME: "/",
        ABOUT: "/about",
        CONTACT: "/contact",
      } as const;
    `,
  ],
  invalid: [
    {
      code: "const config = {} as Config;",
      errors: [{ messageId: "noObjectLiteralTypeAssertion" }],
    },
    {
      code: "const user = { name: 'John' } as User;",
      errors: [{ messageId: "noObjectLiteralTypeAssertion" }],
    },
    {
      code: $`
        // Empty line between comment and assertion
        
        const value = {} as Type;
      `,
      errors: [{ messageId: "noObjectLiteralTypeAssertion" }],
    },
  ],
});
