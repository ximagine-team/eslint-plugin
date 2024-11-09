import { TSESTree } from "@typescript-eslint/utils";

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
      ChainExpression(node) {
        if (isInsideJSXExpression(node)) {
          context.report({
            node,
            messageId: "noJsxOptionalChaining",
          });
        }
      },
    };
  },
});

export default rule;
