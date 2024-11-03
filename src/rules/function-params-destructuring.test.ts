import { unindent as $ } from "eslint-vitest-rule-tester";

import { runTest } from "../utils/run-test";
import rule, { RULE_NAME } from "./function-params-destructuring";

runTest({
  name: RULE_NAME,
  rule,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  valid: [
    // Regular function
    "function foo(person: Person) { const { name } = person }",
    // Arrow function
    "const foo = (item: Item) => { const { id } = item }",
    // No destructuring
    "function foo(a: number) { return a }",
    // Already destructured in body
    "function foo(data) { const { x, y } = data }",
    // Correctly using props for Props type
    "function Button(props: ButtonProps) { const { onClick } = props }",
    // Correctly using props for JSX return
    "function Card(props: CardType) { const { title } = props; return <div>{title}</div> }",
    // Valid with default maxDestructuredProperties (2)
    "function foo({ name, age }: Person) { return name + age }",
    "const bar = ({ id, value }: Item) => id + value",
    // Valid with custom maxDestructuredProperties
    {
      code: "function foo({ name, age, email }: Person) { return name }",
      options: [{ maxDestructuredProperties: 3 }],
    },
    {
      code: "const bar = ({ a, b, c }: Type) => a + b + c",
      options: [{ maxDestructuredProperties: 3 }],
    },
  ],
  invalid: [
    // Exceeds default maxDestructuredProperties (2)
    {
      code: "function foo({ name, age, email }: Person) { console.log(name) }",
      output:
        "function foo(person: Person) {\n  const { name, age, email } = person\n  console.log(name)\n}",
      errors: [{ messageId: "noParamDestructuring" }],
    },
    {
      code: "const foo = ({ id, value, type, name }: Item) => value",
      output:
        "const foo = (item: Item) => {\n  const { id, value, type, name } = item\n  return value\n}",
      errors: [{ messageId: "noParamDestructuring" }],
    },
    // Exceeds custom maxDestructuredProperties
    {
      code: "function process({ a, b, c, d }: Props) { return a + b }",
      output:
        "function process(props: Props) {\n  const { a, b, c, d } = props\n  return a + b\n}",
      options: [{ maxDestructuredProperties: 3 }],
      errors: [{ messageId: "noParamDestructuring" }],
    },
    // Rest operator
    {
      code: "function process({ x, y, ...rest }: Props) { return x + y }",
      output:
        "function process(props: Props) {\n  const { x, y, ...rest } = props\n  return x + y\n}",
      errors: [{ messageId: "noParamDestructuring" }],
    },
    // JSX return without Props suffix
    {
      code: "const Card = ({ title, description, image }: CardType) => <div>{title}</div>",
      output:
        "const Card = (props: CardType) => {\n  const { title, description, image } = props\n  return <div>{title}</div>\n}",
      errors: [{ messageId: "noParamDestructuring" }],
    },
    {
      code: $`
        const Component = ({ 
          name,
          age,
          email 
        }: Props) => {
          return <div>{name}</div>
        }
      `,
      output: $`
        const Component = (props: Props) => {
          const { name, age, email } = props
          return <div>{name}</div>
        }
      `,
      errors: [{ messageId: "noParamDestructuring" }],
    },
    // Test cases for Props naming convention
    {
      code: "function Button({ onClick, className, disabled }: ButtonProps) { return <button onClick={onClick} /> }",
      output:
        "function Button(props: ButtonProps) {\n  const { onClick, className, disabled } = props\n  return <button onClick={onClick} />\n}",
      errors: [{ messageId: "noParamDestructuring" }],
    },
    {
      code: "const Input = ({ value, onChange, placeholder }: InputProps) => <input value={value} onChange={onChange} />",
      output:
        "const Input = (props: InputProps) => {\n  const { value, onChange, placeholder } = props\n  return <input value={value} onChange={onChange} />\n}",
      errors: [{ messageId: "noParamDestructuring" }],
    },
  ],
});
