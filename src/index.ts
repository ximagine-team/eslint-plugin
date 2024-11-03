import type { Linter } from "eslint";

import type { Plugin, RuleSet } from "./types";

import { rules } from "./rules";

export const pluginName = "ximagine";

/**
 * Custom ESLint plugin
 */
const plugin: Plugin = {
  meta: {
    name: pluginName,
  },
  rules,
  configs: {
    get recommended() {
      return recommended;
    },
  },
};

const recommended: Linter.Config = {
  plugins: {
    [pluginName]: plugin,
  },
  rules: {
    [`${pluginName}/no-uncaught-mutate-async`]: "error",
    [`${pluginName}/no-void-mutate-async`]: "error",
    [`${pluginName}/function-params-destructuring`]: "warn",
    [`${pluginName}/prefer-one-line-arrow-function`]: "warn",
    [`${pluginName}/enforce-request-prefix`]: "warn",
    [`${pluginName}/no-jsx-non-null-assertion`]: "warn",
    [`${pluginName}/no-unsafe-type-assertion`]: "warn",
  } satisfies RuleSet,
};

export default plugin;
