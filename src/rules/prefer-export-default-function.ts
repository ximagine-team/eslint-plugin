import { TSESTree } from "@typescript-eslint/utils";

import { createEslintRule, type RuleModule } from "../utils/create-rule";

export const RULE_NAME = "prefer-export-default-function";

type MessageIds = "preferExportDefaultFunction";

type Options = [];

const rule: RuleModule<Options> = createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer 'export default function' over separate export default",
    },
    fixable: "code",
    schema: [],
    messages: {
      preferExportDefaultFunction:
        "Prefer 'export default function' over separate function declaration and export",
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      "ExportDefaultDeclaration > Identifier"(node: TSESTree.Identifier) {
        if (
          node.parent?.type !== TSESTree.AST_NODE_TYPES.ExportDefaultDeclaration
        )
          return;

        const exportDecl = node.parent;
        const scope = context.sourceCode.getScope(exportDecl);

        const variable = scope.variables.find((v) => v.name === node.name);
        if (!variable) return;

        const functionDecl = variable.defs[0]?.node;
        if (
          !functionDecl ||
          functionDecl.type !== TSESTree.AST_NODE_TYPES.FunctionDeclaration
        )
          return;

        // If the function is also exported by name, not reporting
        const hasNamedExport =
          functionDecl.parent?.type ===
          TSESTree.AST_NODE_TYPES.ExportNamedDeclaration;

        if (hasNamedExport) return;

        context.report({
          node: exportDecl,
          messageId: "preferExportDefaultFunction",
          fix(fixer) {
            // Get the function text and normalize indentation
            const functionText = context.sourceCode
              .getText(functionDecl)
              .replace(/^function\s+/, ""); // Remove the 'function' keyword

            return [
              // Replace the function declaration with the new export default function
              fixer.replaceText(
                functionDecl,
                `export default function ${functionText}`,
              ),
              // Remove the export default statement
              fixer.remove(exportDecl),
            ];
          },
        });
      },
    };
  },
});

export default rule;
