import { TSESTree } from "@typescript-eslint/utils";

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
      category: "best-practice",
    },
    schema: [],
    messages: {
      noJsxNonNullAssertion:
        "Non-null assertions are not allowed in JSX expressions. Handle null/undefined values before rendering.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    function isInsideJSXExpression(node: TSESTree.Node): boolean {
      let current = node.parent;
      while (current) {
        if (current.type === TSESTree.AST_NODE_TYPES.JSXExpressionContainer) {
          return true;
        }
        if (current.type === TSESTree.AST_NODE_TYPES.JSXSpreadAttribute) {
          return true;
        }
        if (current.type === TSESTree.AST_NODE_TYPES.JSXAttribute) {
          return true;
        }
        current = current.parent;
      }

      return false;
    }

    return {
      TSNonNullExpression(node) {
        if (isInsideJSXExpression(node)) {
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
