import { TSESTree } from "@typescript-eslint/utils";

import hasCommentAbove from "../utils/ast/has-comment-above";
import { createEslintRule, type RuleModule } from "../utils/create-rule";

export const RULE_NAME = "no-unsafe-type-assertion";

type MessageIds = "noUnsafeTypeAssertion";

type Options = [];

const rule: RuleModule<Options> = createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow type assertions through unknown/any without documentation",
    },
    schema: [],
    messages: {
      noUnsafeTypeAssertion:
        "Type assertions through unknown/any must be documented with a comment explaining why it's necessary. Add a comment on the line before the assertion.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    function isUnsafeAssertion(node: TSESTree.TSAsExpression): boolean {
      // Check if it's a assertion through unknown/any (e.g., as unknown as Type or as any as Type)
      if (node.expression.type === TSESTree.AST_NODE_TYPES.TSAsExpression) {
        const innerAssertion = node.expression;
        const innerType = innerAssertion.typeAnnotation;

        return (
          innerType.type === TSESTree.AST_NODE_TYPES.TSUnknownKeyword ||
          innerType.type === TSESTree.AST_NODE_TYPES.TSAnyKeyword
        );
      }

      return false;
    }

    return {
      TSAsExpression(node) {
        if (
          isUnsafeAssertion(node) &&
          !hasCommentAbove(node, context.sourceCode)
        ) {
          context.report({
            node,
            messageId: "noUnsafeTypeAssertion",
          });
        }
      },
    };
  },
});

export default rule;
