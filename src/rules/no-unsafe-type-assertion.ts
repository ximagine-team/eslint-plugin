import { TSESTree } from "@typescript-eslint/utils";

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
      category: "best-practice",
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
      // Check if it's a double assertion (e.g., as unknown as Type or as any as Type)
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

    function hasExplanatoryComment(node: TSESTree.Node): boolean {
      const { sourceCode } = context;

      // Get the start line of the entire assertion expression
      let targetNode = node;
      while (
        targetNode.parent?.type === TSESTree.AST_NODE_TYPES.TSAsExpression
      ) {
        targetNode = targetNode.parent;
      }

      const comments = sourceCode.getAllComments();

      // Check for comments in the lines immediately before the assertion
      return comments.some((comment) => {
        const commentLine = sourceCode.getLocFromIndex(comment.range[0]).line;
        const commentEndLine = sourceCode.getLocFromIndex(
          comment.range[1],
        ).line;

        const nextToken = sourceCode.getTokenAfter(comment, {
          includeComments: true,
        });

        if (!nextToken) return false;

        const nextTokenLine = sourceCode.getLocFromIndex(
          nextToken.range[0],
        ).line;

        // For multi-line comments, use the end line instead of the start line
        const effectiveCommentLine =
          comment.type === TSESTree.AST_TOKEN_TYPES.Block
            ? commentEndLine
            : commentLine;

        return (
          comment.value.trim().length > 0 &&
          nextTokenLine === effectiveCommentLine + 1 &&
          nextToken.range[0] <= targetNode.range[0]
        );
      });
    }

    return {
      TSAsExpression(node) {
        if (isUnsafeAssertion(node) && !hasExplanatoryComment(node)) {
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
