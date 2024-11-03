import type { ESLint, Linter } from "eslint";

import type { pluginName } from ".";
import type { RuleName } from "./rules";

// Manually typed to avoid jsr complaining about the slow type
export type Plugin = ESLint.Plugin & {
  configs: ESLint.Plugin["configs"] & {
    recommended: Linter.Config;
  };
};

export type RuleSet = Partial<
  Record<`${typeof pluginName}/${RuleName}`, Linter.RuleEntry>
>;
