# function-params-destructuring

Enforce destructuring function parameters in the function body instead of the parameter list.

## Rule Details

This rule enforces a coding style where object parameters are not destructured in the parameter list, but rather in the first line of the function body. By default, it allows destructuring of up to 2 properties in the parameter list.

### Parameter Naming Convention

The rule follows these priorities when naming parameters:

1. If the function returns JSX (React components), the parameter will be named `props`
2. If the type ends with `Props` (including intersection types like `ButtonProps & HTMLProps`), the parameter will also be named `props`
3. For other types, the parameter will be named as camelCase of the type name (e.g., `Person` -> `person`)
4. If type cannot be inferred, fallback to `params`

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

The rule accepts an options object with the following properties:

```ts
interface Options {
  maxDestructuredProperties?: number; // default: 2
}
```

### `maxDestructuredProperties`

By default, this rule allows destructuring of up to 2 properties in the parameter list. You can customize this limit using the `maxDestructuredProperties` option:

```json
{
  "rules": {
    "function-params-destructuring": [
      "error",
      { "maxDestructuredProperties": 3 }
    ]
  }
}
```

With this configuration, the following code would be valid:

```ts
function foo({ name, age, email }: Person) {
  console.log(name, age, email);
}
```
