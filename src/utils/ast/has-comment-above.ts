import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { TSESTree } from "@typescript-eslint/utils";

export default function hasCommentAbove<
  MessageIds extends string,
  Options extends readonly unknown[],
>(node: TSESTree.Node, context: RuleContext<MessageIds, Options>): boolean {
  const { sourceCode } = context;

  const comments = sourceCode.getAllComments();

  // Check for comments in the lines immediately before the node
  return comments.some((comment) => {
    const commentLine = sourceCode.getLocFromIndex(comment.range[0]).line;
    const commentEndLine = sourceCode.getLocFromIndex(comment.range[1]).line;

    const nextToken = sourceCode.getTokenAfter(comment, {
      includeComments: true,
    });

    if (!nextToken) return false;

    const nextTokenLine = sourceCode.getLocFromIndex(nextToken.range[0]).line;

    // For multi-line comments, use the end line instead of the start line
    const effectiveCommentLine =
      comment.type === TSESTree.AST_TOKEN_TYPES.Block
        ? commentEndLine
        : commentLine;

    return (
      comment.value.trim().length > 0 &&
      nextTokenLine === effectiveCommentLine + 1 &&
      nextToken.range[0] <= node.range[0]
    );
  });
}
