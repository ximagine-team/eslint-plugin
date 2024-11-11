import { unindent as $ } from "eslint-vitest-rule-tester";

import { runTest } from "../utils/run-test";
import rule, { RULE_NAME } from "./prefer-export-default-function";

runTest({
  name: RULE_NAME,
  rule,
  valid: [
    // Already using export default function
    "export default function foo() {}",
    // Export default with non-function
    "export default 42",
    "export default class Foo {}",
    // Named exports
    "export function foo() {}",
    // Arrow functions are fine
    "const foo = () => {}; export default foo",
    // Exported by both named and default
    $`
      export function foo() {}
      export default foo;
    `,
  ],
  invalid: [
    {
      code: $`
        function foo() {
          return 42;
        }
        export default foo;
      `,
      output: "export default function foo() {\n  return 42;\n}\n",
      errors: [{ messageId: "preferExportDefaultFunction" }],
    },
    {
      code: $`
        function processData() {
          const result = doSomething();
          return result;
        }

        const anotherVariable = 1;

        export default processData;
      `,
      output:
        "export default function processData() {\n  const result = doSomething();\n  return result;\n}\n\nconst anotherVariable = 1;\n\n",
      errors: [{ messageId: "preferExportDefaultFunction" }],
    },
  ],
});
