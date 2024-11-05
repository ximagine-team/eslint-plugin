import type { RuleModule } from "src/utils/create-rule";

import { groupBy, kebabCase, startCase } from "es-toolkit";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pluginName } from "src/types";

import plugin from "../src/index";
import { rules } from "../src/rules";

const recommendedRules = new Set(
  Object.keys(plugin.configs.recommended.rules!),
);

const DEFAULT_CATEGORY_NAME = "general";

function generateRuleHeader(ruleName: string) {
  const rulesRecord = rules as Record<string, RuleModule<unknown[]>>;
  const rule = rulesRecord[ruleName];
  const { meta } = rule;

  if (!meta?.docs) {
    throw new Error(`Docs meta not found for rule ${ruleName}`);
  }

  const isRecommended = recommendedRules.has(`${pluginName}/${ruleName}`);
  const isFixable = !!meta?.fixable;

  const lines: string[] = [
    `# ${ruleName}`,
    "",
    `${meta.docs.description}.`,
    "",
  ];

  // Add recommended badge if applicable
  if (isRecommended) {
    lines.push(
      `✅ This rule is _enabled_ in the \`recommended\` [config](https://github.com/ximagine-ai/eslint-plugin#configs).`,
      "",
    );
  } else {
    lines.push(
      `🚫 This rule is _disabled_ in the \`recommended\` [config](https://github.com/ximagine-ai/eslint-plugin#configs).`,
      "",
    );
  }

  // Add fixable badge if applicable
  if (isFixable) {
    lines.push(
      `🔧 This rule is automatically fixable by the [\`--fix\` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).`,
      "",
    );
  }

  const category = meta.docs.category ?? DEFAULT_CATEGORY_NAME;
  // Add category info
  lines.push(
    `📋 This rule belongs to the \`${category}\` [category](../../README.md#${kebabCase(category)}).`,
    "",
    "<!-- end auto-generated rule header -->",
    "<!-- Do not manually modify this header. Run: `pnpm run gen:docs` -->",
    "",
    "##",
  );

  return lines.join("\n");
}

function updateRuleDoc(ruleName: string) {
  const docPath = path.resolve(
    import.meta.dirname,
    `../src/rules/${ruleName}.md`,
  );

  const content = readFileSync(docPath, "utf8");

  // Find the position of the first level 2 heading
  const level2HeadingIndex = content.indexOf("##");
  if (level2HeadingIndex === -1) {
    console.error(`Could not find "##" in ${ruleName}.md`);

    return;
  }

  // Generate new header
  const newHeader = generateRuleHeader(ruleName);

  // Combine new header with existing content after "##"
  const newContent =
    newHeader + content.slice(level2HeadingIndex + "##".length);

  writeFileSync(docPath, newContent);
  console.log(`✅ Updated ${ruleName}.md`);
}

function generateRulesTable() {
  const rulesRecord = rules as Record<string, RuleModule<unknown[]>>;

  // Group rules by category
  const rulesByCategory = groupBy(
    Object.entries(rulesRecord),
    (rule) => rule[1].meta?.docs?.category ?? DEFAULT_CATEGORY_NAME,
  );

  const generateTable = (rules: [string, RuleModule<unknown[]>][]) => {
    const tableHeader = [
      "| Name | Description | 💼 | 🔧 |",
      "| :--- | :---------- | :- | :- |",
    ];

    const tableRows = rules.map(([ruleName, rule]) => {
      const { meta } = rule;
      if (!meta?.docs) {
        throw new Error(`Docs meta not found for rule ${ruleName}`);
      }

      const isRecommended = recommendedRules.has(`${pluginName}/${ruleName}`);
      const isFixable = !!meta.fixable;

      const name = `[${ruleName}](src/rules/${ruleName}.md)`;
      const { description } = meta.docs;
      const recommended = isRecommended ? "✅" : "";
      const fixable = isFixable ? "🔧" : "";

      return `| ${name} | ${description} | ${recommended} | ${fixable} |`;
    });

    return [...tableHeader, ...tableRows].join("\n");
  };

  // Generate content with category sections
  const content = [
    "## Rules",
    "",
    "<!-- Do not manually modify this list. Run: `pnpm run gen:docs` -->",
    "<!-- begin auto-generated rules list -->",
    "",
    "✅ Set in the `recommended` [configuration](https://github.com/ximagine-ai/eslint-plugin#configs).",
    "🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).",
    "",
  ];

  // Sort categories to ensure consistent order
  const sortedCategories = Object.entries(rulesByCategory).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  // Generate tables for each category
  for (const [category, rules] of sortedCategories) {
    content.push(`### ${startCase(category)}`, "", generateTable(rules), "");
  }

  content.push("<!-- end auto-generated rules list -->", "");

  return content.join("\n");
}

function updateReadme() {
  const readmePath = path.resolve(import.meta.dirname, "../README.md");
  const content = readFileSync(readmePath, "utf8");

  // Find the position between ## Rules and the next ##
  const rulesStart = content.indexOf("## Rules");

  if (rulesStart === -1) {
    console.error("Could not find ## Rules section in README.md");

    return;
  }

  // Find the next section after ## Rules
  const nextSectionStart = content.slice(rulesStart + 8).search(/^##\s/m);

  // Calculate the actual end position
  const rulesEnd =
    nextSectionStart === -1
      ? content.length
      : rulesStart + 8 + nextSectionStart;

  // Generate new rules table
  const newRulesSection = generateRulesTable();

  // Combine content
  const newContent =
    content.slice(0, rulesStart) + newRulesSection + content.slice(rulesEnd);

  writeFileSync(readmePath, newContent);
  console.log("✅ Updated README.md rules section");
}

// Update all rule docs
for (const ruleName of Object.keys(rules)) {
  updateRuleDoc(ruleName);
}

// Update README
updateReadme();
