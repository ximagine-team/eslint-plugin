# function-params-destructuring

Enforce destructuring function parameters in the function body.

✅ This rule is _enabled_ in the `recommended` [config](https://github.com/ximagine-ai/eslint-plugin#configs).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

📋 This rule belongs to the `code-style` [category](../../README.md#code-style).

<!-- end auto-generated rule header -->
<!-- Do not manually modify this header. Run: `pnpm run gen:docs` -->

## Rule Details

This rule enforces a coding style where object parameters are not destructured in the parameter list, but rather in the first line of the function body. By default, it allows destructuring of up to 2 properties in the parameter list.

### Parameter Naming Convention

When applying auto-fix:

1. If the function returns JSX (React components), the parameter will be named `props`
2. Otherwise, the parameter will be named `params`

### ❌ Incorrect

```ts
// Too many destructured properties
function foo({ name, age, email, address }: Person) {
  console.log(name, age, email, address);
}

// Arrow function with too many destructured properties
const getUser = ({ id, name, email }: User) => id;
```

### ✅ Correct

```ts
// Destructuring in function body
function foo(person: Person) {
  const { name, age, email, address } = person
  console.log(name, age, email, address)
}

// Only 2 properties destructured (within limit)
function bar({ name, age }: Person) {
  console.log(name, age)
}

// React component using props
const Card = (props: CardType) => {
  const { title } = props
  return <div>{title}</div>
}

// Arrow function with proper destructuring
const getUser = (user: User) => {
  const { id, name, email } = user
  return id
}
```

## Options

### `maxDestructuredProperties`

Type: `number`

Default: `2`

The maximum number of destructured properties allowed in the parameter list.

Example:

```ts
/*eslint ximagine/function-params-destructuring: [
    "warn",
    {
      maxDestructuredProperties: 3,
    },
  ]
*/

// ✅ Correct
function foo({ name, age, email }: Person) {
  console.log(name, age, email);
}
```
