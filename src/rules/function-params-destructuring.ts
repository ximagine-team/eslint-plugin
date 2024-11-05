import { TSESTree } from "@typescript-eslint/utils";
import { camelCase } from "es-toolkit";

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
          if (p.type === TSESTree.AST_NODE_TYPES.RestElement)
            return `...${(p.argument as TSESTree.Identifier).name}`;

          return context.sourceCode.getText(p);
        })
        .join(", ");

      return `const { ${properties} } = ${paramName}`;
    }

    function hasPropsType(type: TSESTree.TypeNode): boolean {
      if (type.type === TSESTree.AST_NODE_TYPES.TSTypeReference) {
        const { typeName } = type;
        if (typeName.type === TSESTree.AST_NODE_TYPES.Identifier)
          return typeName.name.endsWith("Props");
      } else if (type.type === TSESTree.AST_NODE_TYPES.TSIntersectionType) {
        return type.types.some((t) => hasPropsType(t));
      }

      return false;
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

      // Check return type annotation if it exists
      if (node.returnType?.typeAnnotation) {
        const returnType = node.returnType.typeAnnotation;

        // Check if return type is JSX.Element or React.ReactNode or similar
        if (returnType.type === TSESTree.AST_NODE_TYPES.TSTypeReference) {
          const { typeName } = returnType;
          if (typeName.type === TSESTree.AST_NODE_TYPES.Identifier) {
            const { name } = typeName;

            return (
              name === "JSX.Element" ||
              name === "ReactElement" ||
              name.includes("JSX") ||
              name.includes("React")
            );
          }
        }
      }

      return false;
    }

    function suggestParamName(
      param: TSESTree.ObjectPattern,
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
    ): string {
      // If function returns JSX, use 'props'
      if (returnsJSX(node)) return "props";

      // Try to infer a good parameter name from the type annotation
      if (param.typeAnnotation?.typeAnnotation) {
        const typeNode = param.typeAnnotation.typeAnnotation;
        // If any part of the type ends with Props, use 'props'
        if (hasPropsType(typeNode)) return "props";

        // For simple type reference, convert to camelCase
        if (
          typeNode.type === TSESTree.AST_NODE_TYPES.TSTypeReference &&
          typeNode.typeName.type === TSESTree.AST_NODE_TYPES.Identifier
        ) {
          const { name } = typeNode.typeName;

          return camelCase(name);
        }
      }

      // Fallback to 'params'
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

            const paramName = suggestParamName(param, node);
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
