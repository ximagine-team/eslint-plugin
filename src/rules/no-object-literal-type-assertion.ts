import { TSESTree } from "@typescript-eslint/utils";

import hasCommentAbove from "../utils/ast/has-comment-above";
import { createEslintRule, type RuleModule } from "../utils/create-rule";

export const RULE_NAME = "no-object-literal-type-assertion";

type MessageIds = "noObjectLiteralTypeAssertion";

type Options = [];

const rule: RuleModule<Options> = createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow type assertions on object literals without documentation",
    },
    schema: [],
    messages: {
      noObjectLiteralTypeAssertion:
        "Type assertions on object literals must be documented with a comment explaining why it's necessary. Add a comment on the line before the assertion.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    function isObjectLiteral(node: TSESTree.Node): boolean {
      return node.type === TSESTree.AST_NODE_TYPES.ObjectExpression;
    }

    function isConstAssertion(node: TSESTree.TSAsExpression): boolean {
      return (
        node.typeAnnotation.type === TSESTree.AST_NODE_TYPES.TSTypeReference &&
        node.typeAnnotation.typeName.type ===
          TSESTree.AST_NODE_TYPES.Identifier &&
        node.typeAnnotation.typeName.name === "const"
      );
    }

    return {
      TSAsExpression(node) {
        if (
          isObjectLiteral(node.expression) &&
          !isConstAssertion(node) &&
          !hasCommentAbove(node, context.sourceCode)
        ) {
          context.report({
            node,
            messageId: "noObjectLiteralTypeAssertion",
          });
        }
      },
    };
  },
});

export default rule;
