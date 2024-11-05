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

declare module "@typescript-eslint/utils/ts-eslint" {
  interface RuleMetaDataDocs {
    /**
     * Utilizing the rule category meta to group rules in the README.
     * Only for internal use.
     */
    category:
      | "best-practice"
      | "code-style"
      | "import-export"
      | "react-jsx"
      | "react-query";
  }
}
