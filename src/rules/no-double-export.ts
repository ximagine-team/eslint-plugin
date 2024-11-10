import { TSESTree } from "@typescript-eslint/utils";

import { createEslintRule, type RuleModule } from "../utils/create-rule";

export const RULE_NAME = "no-double-export";

type MessageIds = "noDoubleExport";

type Options = [];

const rule: RuleModule<Options> = createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow having both named export and default export of the same identifier",
    },
    schema: [],
    messages: {
      noDoubleExport:
        "Avoid exporting the same identifier as both named and default export",
    },
  },
  defaultOptions: [],
  create: (context) => {
    const exportDeclarations: {
      named: TSESTree.ExportNamedDeclaration[];
      default?: TSESTree.ExportDefaultDeclaration;
    } = {
      named: [],
    };

    return {
      ExportNamedDeclaration(node) {
        exportDeclarations.named.push(node);
      },

      ExportDefaultDeclaration(node) {
        exportDeclarations.default = node;
      },

      "Program:exit"() {
        for (const namedExport of exportDeclarations.named) {
          if (!namedExport.declaration) continue;
          const { declaration } = namedExport;
          let exportName: string | null = null;

          switch (declaration.type) {
            case TSESTree.AST_NODE_TYPES.FunctionDeclaration: {
              if (!declaration.id) continue;
              exportName = declaration.id.name;
              break;
            }
            case TSESTree.AST_NODE_TYPES.VariableDeclaration: {
              const varDeclaration = declaration.declarations[0];
              if (varDeclaration.id.type !== TSESTree.AST_NODE_TYPES.Identifier)
                continue;
              exportName = varDeclaration.id.name;
              break;
            }
            case TSESTree.AST_NODE_TYPES.TSTypeAliasDeclaration: {
              exportName = declaration.id.name;
              break;
            }
          }

          if (
            exportName &&
            exportDeclarations.default?.declaration.type ===
              TSESTree.AST_NODE_TYPES.Identifier &&
            exportDeclarations.default.declaration.name === exportName
          ) {
            context.report({
              node: namedExport,
              messageId: "noDoubleExport",
            });
            context.report({
              node: exportDeclarations.default,
              messageId: "noDoubleExport",
            });
          }
        }
      },
    };
  },
});

export default rule;
