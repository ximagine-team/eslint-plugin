import { TSESTree } from "@typescript-eslint/utils";

import { createEslintRule, type RuleModule } from "../utils/create-rule";

export const RULE_NAME = "no-uncaught-mutate-async";

type MessageIds = "noUncaughtMutateAsync";

type Options = [];

const rule: RuleModule<Options> = createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce wrapping React Query mutateAsync calls in try-catch blocks",
      category: "react-query",
    },
    schema: [],
    messages: {
      noUncaughtMutateAsync:
        "React Query mutateAsync calls must be wrapped in try-catch blocks",
    },
  },
  defaultOptions: [],
  create: (context) => {
    function isMutateAsyncCall(node: TSESTree.Node): boolean {
      if (node.type !== TSESTree.AST_NODE_TYPES.CallExpression) return false;

      const { callee } = node;
      if (callee.type !== TSESTree.AST_NODE_TYPES.MemberExpression)
        return false;

      const { property } = callee;

      return (
        property.type === TSESTree.AST_NODE_TYPES.Identifier &&
        property.name === "mutateAsync"
      );
    }

    function isInsideTryCatch(node: TSESTree.Node): boolean {
      let { parent } = node;
      while (parent) {
        if (parent.type === TSESTree.AST_NODE_TYPES.TryStatement) {
          return true;
        }
        ({ parent } = parent);
      }

      return false;
    }

    return {
      CallExpression: (node) => {
        if (isMutateAsyncCall(node) && !isInsideTryCatch(node)) {
          const targetNode =
            node.parent?.type === TSESTree.AST_NODE_TYPES.AwaitExpression
              ? node.parent
              : node;

          context.report({
            node: targetNode,
            messageId: "noUncaughtMutateAsync",
          });
        }
      },
    };
  },
});

export default rule;
