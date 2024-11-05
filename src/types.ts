import type { ESLint, Linter } from "eslint";

import type { RuleName } from "./rules";

export const pluginName = "ximagine";

// Manually typed to avoid jsr complaining about the slow type
export type XimaginePlugin = ESLint.Plugin & {
  configs: ESLint.Plugin["configs"] & {
    recommended: Linter.Config;
  };
};

export type RuleSet = Partial<
  Record<`${typeof pluginName}/${RuleName}`, Linter.RuleEntry>
>;
