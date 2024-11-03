import { unindent as $ } from "eslint-vitest-rule-tester";

import { runTest } from "../utils/run-test";
import rule, { RULE_NAME } from "./no-unsafe-type-assertion";

runTest({
  name: RULE_NAME,
  rule,
  valid: [
    // Direct type assertions
    "const value = data as string",
    "const num = input as number",

    // Documented unsafe assertions with single-line comment
    $`
      // Need to cast through unknown due to external type constraints
      const value = data as unknown as TargetType;
    `,

    // Formatted code block being cast through unknown
    $`
      // Passed through unknown to avoid type errors
      (
        ref.current as unknown as TargetType
      ).createImage() as HTMLImageElement
    `,

    // Documented unsafe assertions with multi-line comment
    $`
      /*
       * Complex type assertion needed because
       * the source type is from an external system
       */
      const config = data as unknown as Config;
    `,

    // Not unsafe assertions
    "const value = data as const",
    "const elem = event.target as HTMLInputElement",
  ],
  invalid: [
    {
      code: "const value = data as unknown as TargetType;",
      errors: [{ messageId: "noUnsafeTypeAssertion" }],
    },
    {
      code: "const data = response as any as UserData;",
      errors: [{ messageId: "noUnsafeTypeAssertion" }],
    },
    {
      code: $`
        // Just a random comment

        const config = data as unknown as Config;
      `,
      errors: [{ messageId: "noUnsafeTypeAssertion" }],
    },
    {
      code: $`
        // Empty line between comment and assertion

        const value = data as any as Type;
      `,
      errors: [{ messageId: "noUnsafeTypeAssertion" }],
    },
  ],
});
