import type { RuleModule } from "src/utils/create-rule";

import enforceRequestPrefix from "./enforce-request-prefix";
import functionParamsDestructuring from "./function-params-destructuring";
import noJsxNonNullAssertion from "./no-jsx-non-null-assertion";
import noUncaughtMutateAsync from "./no-uncaught-mutate-async";
import noUnsafeTypeAssertion from "./no-unsafe-type-assertion";
import noVoidMutateAsync from "./no-void-mutate-async";
import preferOneLineArrowFunction from "./prefer-one-line-arrow-function";

export const rules = {
  "enforce-request-prefix": enforceRequestPrefix,
  "function-params-destructuring": functionParamsDestructuring,
  "no-jsx-non-null-assertion": noJsxNonNullAssertion,
  "no-uncaught-mutate-async": noUncaughtMutateAsync,
  "no-unsafe-type-assertion": noUnsafeTypeAssertion,
  "no-void-mutate-async": noVoidMutateAsync,
  "prefer-one-line-arrow-function": preferOneLineArrowFunction,
} satisfies Record<string, RuleModule<unknown[]>>;

export type RuleName = keyof typeof rules;
