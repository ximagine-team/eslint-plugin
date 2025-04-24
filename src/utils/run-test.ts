import type {
  RuleTesterInitOptions,
  TestCasesOptions,
} from "eslint-vitest-rule-tester";

import tsParser from "@typescript-eslint/parser";
import { run } from "eslint-vitest-rule-tester";

export function runTest(
  options: TestCasesOptions & RuleTesterInitOptions,
): void {
  run({
    parser: tsParser,
    ...options,
  }).catch((error) => {
    console.error(error);
  });
}
