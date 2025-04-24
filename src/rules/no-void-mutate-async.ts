import { TSESTree } from "@typescript-eslint/utils";

import { createEslintRule, type RuleModule } from "../utils/create-rule";

export const RULE_NAME = "no-void-mutate-async";

type MessageIds = "noVoidMutateAsync";

type Options = [];

const rule: RuleModule<Options> = createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow using void operator with React Query mutateAsync calls",
    },
    fixable: "code",
    schema: [],
    messages: {
      noVoidMutateAsync:
        "Do not use void operator with mutateAsync calls. Use mutate instead.",
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

    function getMutateCallText(node: TSESTree.CallExpression): string {
      const { callee } = node;
      if (callee.type !== TSESTree.AST_NODE_TYPES.MemberExpression) return "";

      // Get the object part (e.g., "user" from "user.mutateAsync")
      const objectText = context.sourceCode.getText(callee.object);

      // Get the arguments
      const argsText = node.arguments
        .map((arg) => context.sourceCode.getText(arg))
        .join(", ");

      return `${objectText}.mutate(${argsText})`;
    }

    return {
      UnaryExpression(node) {
        if (node.operator !== "void") return;

        const { argument } = node;
        if (
          argument.type === TSESTree.AST_NODE_TYPES.AwaitExpression &&
          isMutateAsyncCall(argument.argument)
        ) {
          context.report({
            node,
            messageId: "noVoidMutateAsync",
            fix(fixer) {
              if (
                argument.argument.type !==
                TSESTree.AST_NODE_TYPES.CallExpression
              ) {
                return null;
              }

              return fixer.replaceText(
                node,
                getMutateCallText(argument.argument),
              );
            },
          });
        } else if (isMutateAsyncCall(argument)) {
          context.report({
            node,
            messageId: "noVoidMutateAsync",
            fix(fixer) {
              if (argument.type !== TSESTree.AST_NODE_TYPES.CallExpression)
                return null;

              return fixer.replaceText(node, getMutateCallText(argument));
            },
          });
        }
      },
    };
  },
});

export default rule;
