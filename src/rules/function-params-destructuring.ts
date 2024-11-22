import { TSESTree } from "@typescript-eslint/utils";

import { createEslintRule, type RuleModule } from "../utils/create-rule";

export const RULE_NAME = "function-params-destructuring";

type MessageIds = "noParamDestructuring";

type Options = [{ maxDestructuredProperties?: number }];

const rule: RuleModule<Options> = createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce destructuring function parameters in the function body",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          maxDestructuredProperties: {
            type: "number",
            minimum: 0,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noParamDestructuring:
        "Function parameters should not be destructured if the number of properties exceeds {{maxDestructuredProperties}}. Destructure in function body instead.",
    },
  },
  defaultOptions: [{ maxDestructuredProperties: 2 }],
  create: (context) => {
    const options = context.options[0] ?? { maxDestructuredProperties: 2 };
    const { maxDestructuredProperties } = options;

    function getTypeAnnotation(param: TSESTree.ObjectPattern) {
      if (!param.typeAnnotation) return "";

      return `: ${context.sourceCode.getText(param.typeAnnotation.typeAnnotation)}`;
    }

    function generateDestructuring(
      param: TSESTree.ObjectPattern,
      paramName: string,
    ) {
      const properties = param.properties
        .map((p) => {
          if (
            p.type === TSESTree.AST_NODE_TYPES.RestElement &&
            p.argument.type === TSESTree.AST_NODE_TYPES.Identifier
          )
            return `...${p.argument.name}`;

          return context.sourceCode.getText(p);
        })
        .join(", ");

      return `const { ${properties} } = ${paramName}`;
    }

    function returnsJSX(
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
    ): boolean {
      // Check for direct JSX return in arrow functions
      if (
        node.body.type === TSESTree.AST_NODE_TYPES.JSXElement ||
        node.body.type === TSESTree.AST_NODE_TYPES.JSXFragment
      ) {
        return true;
      }

      // Check function body for JSX returns
      if (node.body.type === TSESTree.AST_NODE_TYPES.BlockStatement) {
        const containsJSXReturn = node.body.body.some((statement) => {
          if (statement.type === TSESTree.AST_NODE_TYPES.ReturnStatement) {
            const { argument } = statement;

            return (
              argument &&
              (argument.type === TSESTree.AST_NODE_TYPES.JSXElement ||
                argument.type === TSESTree.AST_NODE_TYPES.JSXFragment)
            );
          }

          return false;
        });

        if (containsJSXReturn) {
          return true;
        }
      }

      return false;
    }

    function suggestParamName(
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
    ): string {
      // If function returns JSX, use 'props'
      if (returnsJSX(node)) return "props";

      // Otherwise, use 'params'
      return "params";
    }

    return {
      "FunctionDeclaration, FunctionExpression, ArrowFunctionExpression": (
        node:
          | TSESTree.FunctionDeclaration
          | TSESTree.FunctionExpression
          | TSESTree.ArrowFunctionExpression,
      ) => {
        for (const param of node.params) {
          if (param.type === TSESTree.AST_NODE_TYPES.ObjectPattern) {
            // Skip if number of properties is less than or equal to maxDestructuredProperties
            if (
              typeof maxDestructuredProperties === "number" &&
              param.properties.length <= maxDestructuredProperties
            ) {
              continue;
            }

            const paramName = suggestParamName(node);
            const typeAnnotation = getTypeAnnotation(param);
            const destructuring = generateDestructuring(param, paramName);

            context.report({
              node: param,
              messageId: "noParamDestructuring",
              data: {
                maxDestructuredProperties,
              },
              fix: (fixer) => {
                const fixes = [];

                // Replace the destructured parameter with a simple parameter
                fixes.push(
                  fixer.replaceText(param, `${paramName}${typeAnnotation}`),
                );

                // Add destructuring as first line in function body
                if (node.body.type === TSESTree.AST_NODE_TYPES.BlockStatement) {
                  const existingBody = context.sourceCode
                    .getText(node.body)
                    .slice(1, -1) // Remove braces
                    .trim();

                  const newBody = `{\n  ${destructuring}\n  ${existingBody}\n}`;
                  fixes.push(fixer.replaceText(node.body, newBody));
                } else if (
                  node.type === TSESTree.AST_NODE_TYPES.ArrowFunctionExpression
                ) {
                  // For arrow functions with expression body, wrap in block
                  const body = context.sourceCode.getText(node.body);
                  fixes.push(
                    fixer.replaceText(
                      node.body,
                      `{\n  ${destructuring}\n  return ${body}\n}`,
                    ),
                  );
                }

                return fixes;
              },
            });
          }
        }
      },
    };
  },
});

export default rule;
