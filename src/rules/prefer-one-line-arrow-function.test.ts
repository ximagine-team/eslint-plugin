import { runTest } from "../utils/run-test";
import rule, { RULE_NAME } from "./prefer-one-line-arrow-function";

const valids = [
  "const fn = () => 42",
  "const fn = () => { console.log(42) }",
  "const fn = () => { const a = 42; return a }",
  "const fn = () => { return }",
];

const invalids = [
  ["const fn = () => { return 42 }", "const fn = () => 42"],
  ["const fn = async () => { return 42 }", "const fn = async () => 42"],
  ["const fn = <T>() => { return 42 }", "const fn = <T>() => 42"],
  [
    "const fn = (a: number): number => { return a + 42 }",
    "const fn = (a: number): number => a + 42",
  ],
  [
    "const fn = async (a: number, b: string): Promise<number> => { return 42 }",
    "const fn = async (a: number, b: string): Promise<number> => 42",
  ],
  ["const fn = () => { return { num: 42 } }", "const fn = () => ({ num: 42 })"],
];

runTest({
  name: RULE_NAME,
  rule,
  valid: valids,
  invalid: invalids.map(([code, output]) => ({
    code,
    output,
    errors: [{ messageId: "preferOneLineArrowFunction" }],
  })),
});
