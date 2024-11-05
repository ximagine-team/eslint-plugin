import { TSESTree } from "@typescript-eslint/utils";

import { createEslintRule, type RuleModule } from "../utils/create-rule";

export const RULE_NAME = "prefer-one-line-arrow-function";

type MessageIds = "preferOneLineArrowFunction";

type Options = [];

const rule: RuleModule<Options> = createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer one-line arrow function expressions over block body when function only has a single return statement",
    },
    fixable: "code",
    schema: [],
    messages: {
      preferOneLineArrowFunction:
        "Arrow function with single return can be simplified",
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      ArrowFunctionExpression(node) {
        // Only check block-level function bodies
        if (node.body.type !== TSESTree.AST_NODE_TYPES.BlockStatement) return;

        const { body } = node.body;
        // Check if there's only one return statement
        if (
          body.length !== 1 ||
          body[0].type !== TSESTree.AST_NODE_TYPES.ReturnStatement
        )
          return;

        const returnStatement = body[0];
        if (!returnStatement.argument) return;

        // Get type annotations for function parameters and return value
        const typeParameters = node.typeParameters
          ? context.sourceCode.getText(node.typeParameters)
          : "";

        const returnType = node.returnType
          ? context.sourceCode.getText(node.returnType)
          : "";

        const params = context.sourceCode
          .getText()
          .slice(
            node.params[0]?.range[0] ?? node.range[0],
            node.params.at(-1)?.range[1] ?? node.range[0],
          );

        // Construct new arrow function expression
        const newArrowFunction = `${node.async ? "async " : ""}${typeParameters}(${params})${returnType} => ${context.sourceCode.getText(returnStatement.argument)}`;

        context.report({
          node,
          messageId: "preferOneLineArrowFunction",
          fix(fixer) {
            return fixer.replaceText(node, newArrowFunction);
          },
        });
      },
    };
  },
});

export default rule;
