import isInsideJSX from "../utils/ast/is-inside-jsx";
import { createEslintRule, type RuleModule } from "../utils/create-rule";

export const RULE_NAME = "no-jsx-non-null-assertion";

type MessageIds = "noJsxNonNullAssertion";

type Options = [];

const rule: RuleModule<Options> = createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "Disallow non-null assertions (!) in JSX expressions",
    },
    schema: [],
    messages: {
      noJsxNonNullAssertion:
        "Non-null assertions are not allowed in JSX expressions. Use intermediate variable and handle null/undefined before rendering.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      TSNonNullExpression(node) {
        if (isInsideJSX(node)) {
          context.report({
            node,
            messageId: "noJsxNonNullAssertion",
          });
        }
      },
    };
  },
});

export default rule;
