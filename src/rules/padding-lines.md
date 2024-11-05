# padding-lines

Enforce padding lines between class members, test suites and object properties..

✅ This rule is _enabled_ in the `recommended` [config](https://github.com/ximagine-ai/eslint-plugin#configs).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

📋 This rule belongs to the `code-style` [category](../../README.md#code-style).

<!-- end auto-generated rule header -->
<!-- Do not manually modify this header. Run: `pnpm run gen:docs` -->

## Rule Details

This rule enforces consistent padding lines:

- Between class members (enabled by default)
- Between variable declarations, test cases and hooks in test suites
- Between object properties (when object name matches `objectPattern`)

### ❌ Incorrect

```ts
// Classes
class Person {
  private readonly id: string;
  public name = "John";
  constructor() {
    this.id = Math.random().toString();
  }
  getName(): string {
    return this.name;
  }
}

// Test suites
describe("api", () => {
  const config = {};
  let worker: Worker;
  beforeAll(() => {});
  beforeEach(() => {});
  it("test1", () => {});
  it("test2", () => {});
  afterEach(() => {});
  afterAll(() => {});
});

// Objects (when matching objectPattern)
const userApi = {
  getUser: () => {},
  createUser: () => {},
  updateUser: () => {},
};
```

### ✅ Correct

```ts
// Classes
class Person {
  private readonly id: string;
  public name = "John";

  constructor() {
    this.id = Math.random().toString();
  }

  getName(): string {
    return this.name;
  }
}

// Test suites
describe("api", () => {
  const config = {};
  let worker: Worker;

  beforeAll(() => {});

  beforeEach(() => {});

  it("test1", () => {});

  it("test2", () => {});

  afterEach(() => {});

  afterAll(() => {});
});

// Objects (when matching objectPattern)
const userApi = {
  getUser: () => {},

  createUser: () => {},

  updateUser: () => {},
};
```

## Options

### `checkClass`

Type: `boolean`

Default: `true`

Whether to check padding lines between class members.

### `describePattern`

Type: `string`

Default: `^describe$`

Regex pattern to match describe-like function names.

### `itPattern`

Type: `string`

Default: `^it$|^test$`

Regex pattern to match it-like function names.

### `objectPattern`

Type: `string`

Regex pattern to match object names that should be checked.

If not provided, objects will not be checked.
