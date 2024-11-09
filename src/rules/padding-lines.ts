import { TSESTree } from "@typescript-eslint/utils";

import { createEslintRule, type RuleModule } from "../utils/create-rule";

export const RULE_NAME = "padding-lines";

type MessageIds = "missingPaddingLine";

type Options = [
  {
    checkClass?: boolean;
    describePattern?: string;
    itPattern?: string;
    objectPattern?: string;
  },
];

const rule: RuleModule<Options> = createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "layout",
    docs: {
      description:
        "Enforce padding lines between class members, test functions and object properties",
    },
    fixable: "whitespace",
    schema: [
      {
        type: "object",
        properties: {
          checkClass: {
            type: "boolean",
            description: "Whether to check padding lines between class members",
            default: true,
          },
          describePattern: {
            type: "string",
            description: "Pattern to match describe-like function names",
            default: "^describe$",
          },
          itPattern: {
            type: "string",
            description: "Pattern to match it-like function names",
            default: "^it$|^test$",
          },
          objectPattern: {
            type: "string",
            description: "Pattern to match object names that should be checked",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingPaddingLine: "Expected blank line between {{type}} items",
    },
  },
  defaultOptions: [{ checkClass: true }],
  create: (context) => {
    const { sourceCode } = context;
    const options = context.options[0] ?? {};

    const shouldCheckClasses = options.checkClass !== false;

    const describeRegex = options.describePattern
      ? new RegExp(options.describePattern)
      : /^describe$/;

    const itRegex = options.itPattern
      ? new RegExp(options.itPattern)
      : /^it$|^test$/;

    const objectRegex = options.objectPattern
      ? new RegExp(options.objectPattern)
      : null;

    // Test lifecycle hooks
    const TEST_HOOKS = new Set([
      "beforeAll",
      "afterAll",
      "beforeEach",
      "afterEach",
    ]);

    function checkPaddingBetweenNodes(items: TSESTree.Node[], type: string) {
      for (let i = 0; i < items.length - 1; i++) {
        const currentItem = items[i];
        const nextItem = items[i + 1];
        const linesBetween =
          sourceCode.getLocFromIndex(nextItem.range[0]).line -
          sourceCode.getLocFromIndex(currentItem.range[1]).line;

        if (linesBetween === 1) {
          context.report({
            node: currentItem,
            loc: {
              start: currentItem.loc.end,
              end: nextItem.loc.start,
            },
            messageId: "missingPaddingLine",
            data: { type },
            fix(fixer) {
              const textBetween = sourceCode
                .getText()
                .slice(currentItem.range[1], nextItem.range[0]);

              const match = /\n(\s*)/.exec(textBetween);
              const indentation = match ? match[1] : "  ";

              const newText = `${textBetween.trim()}\n\n${indentation}`;

              return fixer.replaceTextRange(
                [currentItem.range[1], nextItem.range[0]],
                newText,
              );
            },
          });
        }
      }
    }

    function shouldCheckObject(node: TSESTree.ObjectExpression): boolean {
      if (!objectRegex) return false;

      let currentParent: TSESTree.Node | undefined = node.parent;
      while (currentParent) {
        if (
          currentParent.type === TSESTree.AST_NODE_TYPES.VariableDeclarator &&
          currentParent.id.type === TSESTree.AST_NODE_TYPES.Identifier
        ) {
          return objectRegex.test(currentParent.id.name);
        }
        if (
          currentParent.type === TSESTree.AST_NODE_TYPES.Property &&
          currentParent.key.type === TSESTree.AST_NODE_TYPES.Identifier
        ) {
          return objectRegex.test(currentParent.key.name);
        }
        currentParent = currentParent.parent;
      }

      return false;
    }

    function isTestFunction(node: TSESTree.CallExpression): boolean {
      if (node.callee.type !== TSESTree.AST_NODE_TYPES.Identifier) {
        return false;
      }

      const { name } = node.callee;

      // For describe functions, check against describePattern if provided
      if (describeRegex?.test(name)) {
        return true;
      }

      // For it/test functions, check against itPattern if provided
      if (itRegex?.test(name)) {
        return true;
      }

      // For test lifecycle hooks
      if (TEST_HOOKS.has(name)) {
        return true;
      }

      return false;
    }

    function processTestBlock(node: TSESTree.BlockStatement) {
      const statements = node.body;
      const testCases: TSESTree.Node[] = [];
      let lastVariableDeclaration: TSESTree.Node | null = null;

      // Process each statement in the test block
      for (const statement of statements) {
        // Track variable declarations separately to check padding between vars and tests
        if (statement.type === TSESTree.AST_NODE_TYPES.VariableDeclaration) {
          lastVariableDeclaration = statement;
          continue;
        }

        if (
          statement.type === TSESTree.AST_NODE_TYPES.ExpressionStatement &&
          statement.expression.type ===
            TSESTree.AST_NODE_TYPES.CallExpression &&
          isTestFunction(statement.expression)
        ) {
          if (lastVariableDeclaration) {
            // Check padding between the last variable declaration and the first test
            checkPaddingBetweenNodes(
              [lastVariableDeclaration, statement],
              "test case",
            );
            lastVariableDeclaration = null;
          }
          testCases.push(statement);
        }
      }

      // Check padding between test cases
      if (testCases.length > 1) {
        checkPaddingBetweenNodes(testCases, "test case");
      }

      // Process nested test blocks
      for (const testCase of testCases) {
        if (
          testCase.type === TSESTree.AST_NODE_TYPES.ExpressionStatement &&
          testCase.expression.type === TSESTree.AST_NODE_TYPES.CallExpression &&
          testCase.expression.callee.type ===
            TSESTree.AST_NODE_TYPES.Identifier &&
          describeRegex.test(testCase.expression.callee.name)
        ) {
          const callback = testCase.expression.arguments[1];
          if (
            (callback?.type ===
              TSESTree.AST_NODE_TYPES.ArrowFunctionExpression ||
              callback?.type === TSESTree.AST_NODE_TYPES.FunctionExpression) &&
            callback.body.type === TSESTree.AST_NODE_TYPES.BlockStatement
          ) {
            processTestBlock(callback.body);
          }
        }
      }
    }

    return {
      ObjectExpression(node) {
        if (node.properties.length <= 1) return;
        if (!shouldCheckObject(node)) return;
        checkPaddingBetweenNodes(node.properties, "object property");
      },

      CallExpression(node) {
        if (
          node.callee.type === TSESTree.AST_NODE_TYPES.Identifier &&
          (describeRegex.test(node.callee.name) ||
            (!describeRegex && node.callee.name === "describe"))
        ) {
          const callback = node.arguments[1];
          if (
            (callback?.type ===
              TSESTree.AST_NODE_TYPES.ArrowFunctionExpression ||
              callback?.type === TSESTree.AST_NODE_TYPES.FunctionExpression) &&
            callback.body.type === TSESTree.AST_NODE_TYPES.BlockStatement
          ) {
            processTestBlock(callback.body);
          }
        }
      },

      ClassDeclaration(node) {
        if (node.body.body.length <= 1) return;
        if (!shouldCheckClasses) return;

        const members = node.body.body;
        const propertyGroups: TSESTree.Node[][] = [];
        let currentGroup: TSESTree.Node[] = [];

        const isPropertyDefinition = (node: TSESTree.Node) =>
          node.type === TSESTree.AST_NODE_TYPES.PropertyDefinition ||
          node.type === TSESTree.AST_NODE_TYPES.TSAbstractPropertyDefinition;

        // Group consecutive properties together
        for (const member of members) {
          if (isPropertyDefinition(member)) {
            currentGroup.push(member);
          } else {
            if (currentGroup.length > 0) {
              propertyGroups.push([...currentGroup]);
              currentGroup = [];
            }
            propertyGroups.push([member]);
          }
        }

        if (currentGroup.length > 0) {
          propertyGroups.push(currentGroup);
        }

        // Check padding between groups
        for (let i = 0; i < propertyGroups.length - 1; i++) {
          const currentGroup = propertyGroups[i];
          const nextGroup = propertyGroups[i + 1];
          checkPaddingBetweenNodes(
            [currentGroup.at(-1)!, nextGroup[0]],
            "class member",
          );
        }

        // Check padding between methods
        const methods = members.filter(
          (member) => !isPropertyDefinition(member),
        );

        if (methods.length > 1) {
          checkPaddingBetweenNodes(methods, "class member");
        }
      },
    };
  },
});

export default rule;
