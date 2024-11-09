import { TSESTree } from "@typescript-eslint/utils";

export default function isInsideJSX(node: TSESTree.Node): boolean {
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
