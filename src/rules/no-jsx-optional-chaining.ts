import isInsideJSX from "../utils/ast/is-inside-jsx";
import { createEslintRule, type RuleModule } from "../utils/create-rule";

export const RULE_NAME = "no-jsx-optional-chaining";

type MessageIds = "noJsxOptionalChaining";

type Options = [];

const rule: RuleModule<Options> = createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "Disallow optional chaining (?.) in JSX expressions",
    },
    schema: [],
    messages: {
      noJsxOptionalChaining:
        "Optional chaining is not allowed in JSX expressions. Use intermediate variable and handle null/undefined before rendering.",
    },
  },
  defaultOptions: [],
  create: (context) => ({
    ChainExpression(node) {
      if (isInsideJSX(node)) {
        context.report({
          node,
          messageId: "noJsxOptionalChaining",
        });
      }
    },
  }),
});

export default rule;
