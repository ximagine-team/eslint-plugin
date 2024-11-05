import { TSESTree } from "@typescript-eslint/utils";
import { upperFirst } from "es-toolkit";

import { createEslintRule, type RuleModule } from "../utils/create-rule";

export const RULE_NAME = "enforce-request-prefix";

type MessageIds = "enforceRequestPrefix" | "enforceRequestPrefixDestructured";

type Options = [];

const rule: RuleModule<Options> = createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "Enforce request prefix for React Query hooks",
      category: "react-query",
    },
    fixable: "code",
    schema: [],
    messages: {
      enforceRequestPrefix:
        "React Query hooks should be prefixed with 'request'. Rename '{{name}}' to 'request{{capitalizedName}}'",
      enforceRequestPrefixDestructured:
        "Avoid destructuring React Query hooks directly. Assign to a 'request'-prefixed variable first",
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { sourceCode } = context;

    const reactQueryHookNames = new Set([
      "useQuery",
      "useMutation",
      "useInfiniteQuery",
      "useSuspenseQuery",
      "usePrefetchQuery",
    ]);

    const isReactQueryHook = (name: string): boolean =>
      reactQueryHookNames.has(name);

    function isTRPCReactQueryHook(node: TSESTree.CallExpression): boolean {
      const { callee } = node;
      if (callee.type !== TSESTree.AST_NODE_TYPES.MemberExpression)
        return false;

      const propertyName =
        callee.property.type === TSESTree.AST_NODE_TYPES.Identifier
          ? callee.property.name
          : "";

      return isReactQueryHook(propertyName);
    }

    function isVanillaReactQueryHook(node: TSESTree.CallExpression): boolean {
      const { callee } = node;

      return (
        callee.type === TSESTree.AST_NODE_TYPES.Identifier &&
        isReactQueryHook(callee.name)
      );
    }

    return {
      VariableDeclarator(node) {
        if (node.init?.type === TSESTree.AST_NODE_TYPES.CallExpression) {
          if (node.id.type === TSESTree.AST_NODE_TYPES.Identifier) {
            if (
              node.id.type !== TSESTree.AST_NODE_TYPES.Identifier ||
              node.init?.type !== TSESTree.AST_NODE_TYPES.CallExpression
            )
              return;

            const { name } = node.id;
            if (name.startsWith("request")) return;

            if (
              isTRPCReactQueryHook(node.init) ||
              isVanillaReactQueryHook(node.init)
            ) {
              const capitalizedName = upperFirst(name);
              const scope = sourceCode.getScope(node);
              const variable = scope.variables.find((v) => v.name === name);

              context.report({
                node: node.id,
                messageId: "enforceRequestPrefix",
                data: {
                  name,
                  capitalizedName,
                },
                *fix(fixer) {
                  yield fixer.replaceText(node.id, `request${capitalizedName}`);

                  if (variable) {
                    for (const reference of variable.references) {
                      if (reference.identifier !== node.id) {
                        yield fixer.replaceText(
                          reference.identifier,
                          `request${capitalizedName}`,
                        );
                      }
                    }
                  }
                },
              });
            }
          } else if (
            node.id.type === TSESTree.AST_NODE_TYPES.ObjectPattern &&
            (isTRPCReactQueryHook(node.init) ||
              isVanillaReactQueryHook(node.init))
          ) {
            context.report({
              node: node.id,
              messageId: "enforceRequestPrefixDestructured",
            });
          }
        }
      },
    };
  },
});

export default rule;
