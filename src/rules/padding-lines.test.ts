import { unindent as $ } from "eslint-vitest-rule-tester";

import { runTest } from "../utils/run-test";
import rule, { RULE_NAME } from "./padding-lines";

runTest({
  name: RULE_NAME,
  rule,
  valid: [
    // Objects should be ignored when no pattern is provided
    $`
      const api = {
        getUser: () => {},
        createUser: () => {}
      };
    `,
    // Test suite with proper padding
    $`
      describe("api", () => {
        beforeAll(() => {
          // setup
        });

        beforeEach(() => {
          // setup
        });

        it("test1", () => {});

        it("test2", () => {});

        afterEach(() => {
          // cleanup
        });

        afterAll(() => {
          // cleanup
        });
      });
    `,
    // Single item objects/test suites don't need padding
    $`
      const obj = {
        single: true
      };
    `,
    // Objects not matching pattern should be ignored
    {
      code: $`
        const data = {
          a: 1,
          b: 2
        };
      `,
      options: [{ objectPattern: "Api$" }],
    },
    // Non-describe test functions should be ignored
    {
      code: $`
        test("group", () => {
          beforeAll(() => {});
          it("test1", () => {});
          it("test2", () => {});
          afterAll(() => {});
        });
      `,
      options: [{ describePattern: "^describe$" }],
    },
    // Non-it test cases should be ignored
    {
      code: $`
        describe("group", () => {
          beforeEach(() => {});
          test("test1", () => {});
          test("test2", () => {});
          afterEach(() => {});
        });
      `,
      options: [{ itPattern: "^it$" }],
    },
    // Class with proper padding (default behavior)
    $`
      class User {
        name: string;

        age: number;

        constructor(name: string, age: number) {
          this.name = name;
          this.age = age;
        }

        greet(): string {
          return \`Hello, \${this.name}!\`;
        }
      }
    `,

    // Single member class doesn't need padding
    $`
      class Empty {
        constructor() {}
      }
    `,

    // Class with disabled padding check
    {
      code: $`
        class User {
          name: string;
          age: number;
          constructor(name: string, age: number) {
            this.name = name;
            this.age = age;
          }
          greet(): string {
            return \`Hello, \${this.name}!\`;
          }
        }
      `,
      options: [{ checkClass: false }],
    },

    // Test suite with grouped variables at top
    $`
      describe("api", () => {
        const serviceName = "test_service";
        let worker: TestWorker;
        const config = { timeout: 1000 };

        beforeAll(() => {
          // setup
        });

        it("test1", () => {});

        it("test2", () => {});
      });
    `,

    // Class with grouped properties at top
    $`
      abstract class Service {
        abstract protected config: Config;
        private readonly id: string;
        private worker: Worker;

        constructor() {
          this.id = generateId();
        }

        start(): void {
          this.worker.start();
        }
      }
    `,

    // Nested test suite with grouped variables
    $`
      describe("outer", () => {
        const outerSetup = {};
        
        describe("inner", () => {
          const innerSetup = {};
          let testData: TestData;

          beforeEach(() => {});

          it("should work", () => {});
        });
      });
    `,
  ],
  invalid: [
    // Only check objects matching pattern
    {
      code: $`
        const userApi = {
          get: () => {},
          post: () => {}
        };
      `,
      output: $`
        const userApi = {
          get: () => {},

          post: () => {}
        };
      `,
      options: [{ objectPattern: "Api$" }],
      errors: [
        { messageId: "missingPaddingLine", data: { type: "object property" } },
      ],
    },
    // Check test suites with hooks
    {
      code: $`
        describe("api", () => {
          beforeAll(() => {
            // setup
          });
          beforeEach(() => {
            // setup
          });
          it("test1", () => {});
          it("test2", () => {});
          afterEach(() => {
            // cleanup
          });
          afterAll(() => {
            // cleanup
          });
        });
      `,
      output: $`
        describe("api", () => {
          beforeAll(() => {
            // setup
          });

          beforeEach(() => {
            // setup
          });

          it("test1", () => {});

          it("test2", () => {});

          afterEach(() => {
            // cleanup
          });

          afterAll(() => {
            // cleanup
          });
        });
      `,
      errors: [
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
      ],
    },
    // Check nested test suites with hooks
    {
      code: $`
        describe("api", () => {
          beforeAll(() => {});
          describe("subApi", () => {
            beforeEach(() => {});
            it("test1", () => {});
            afterEach(() => {});
          });
          describe("subApi2", () => {
            beforeEach(() => {});
            it("test2", () => {});
            afterEach(() => {});
          });
          afterAll(() => {});
        });
      `,
      output: $`
        describe("api", () => {
          beforeAll(() => {});

          describe("subApi", () => {
            beforeEach(() => {});

            it("test1", () => {});

            afterEach(() => {});
          });

          describe("subApi2", () => {
            beforeEach(() => {});

            it("test2", () => {});

            afterEach(() => {});
          });

          afterAll(() => {});
        });
      `,
      errors: [
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
      ],
    },
    // Check custom nested test suites with hooks
    {
      code: $`
        defineTestGroup("api", () => {
          beforeEach(() => {});
          defineTestGroup("subApi", () => {
            beforeAll(() => {});
            runTest("test1", () => {});
          });
          defineTestGroup("subApi2", () => {
            beforeAll(() => {});
            runTest("test2", () => {});
          });
        });
      `,
      output: $`
        defineTestGroup("api", () => {
          beforeEach(() => {});

          defineTestGroup("subApi", () => {
            beforeAll(() => {});

            runTest("test1", () => {});
          });

          defineTestGroup("subApi2", () => {
            beforeAll(() => {});

            runTest("test2", () => {});
          });
        });
      `,
      options: [
        {
          describePattern: "^defineTestGroup$",
          itPattern: "^runTest$",
        },
      ],
      errors: [
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
      ],
    },
    // Class without proper padding
    {
      code: $`
        class User {
          name: string;
          age: number;
          constructor(name: string, age: number) {
            this.name = name;
            this.age = age;
          }
          greet(): string {
            return \`Hello, \${this.name}!\`;
          }
        }
      `,
      output: $`
        class User {
          name: string;
          age: number;

          constructor(name: string, age: number) {
            this.name = name;
            this.age = age;
          }

          greet(): string {
            return \`Hello, \${this.name}!\`;
          }
        }
      `,
      errors: [
        { messageId: "missingPaddingLine", data: { type: "class member" } },
        { messageId: "missingPaddingLine", data: { type: "class member" } },
        { messageId: "missingPaddingLine", data: { type: "class member" } },
      ],
    },

    // Class with mixed members (properties, methods, constructor)
    {
      code: $`
        class Complex {
          private readonly id: string;
          public name: string;
          static version = "1.0";
          constructor() {
            this.id = Math.random().toString();
          }
          getName(): string {
            return this.name;
          }
          setName(value: string): void {
            this.name = value;
          }
        }
      `,
      output: $`
        class Complex {
          private readonly id: string;
          public name: string;
          static version = "1.0";

          constructor() {
            this.id = Math.random().toString();
          }

          getName(): string {
            return this.name;
          }

          setName(value: string): void {
            this.name = value;
          }
        }
      `,
      errors: [
        { messageId: "missingPaddingLine", data: { type: "class member" } },
        { messageId: "missingPaddingLine", data: { type: "class member" } },
        { messageId: "missingPaddingLine", data: { type: "class member" } },
        { messageId: "missingPaddingLine", data: { type: "class member" } },
        { messageId: "missingPaddingLine", data: { type: "class member" } },
      ],
    },

    // Test suite with mixed declarations and tests
    {
      code: $`
        describe("api", () => {
          const config = {};
          let worker: Worker;
          it("first test", () => {});
          it("second test", () => {});
        });
      `,
      output: $`
        describe("api", () => {
          const config = {};
          let worker: Worker;

          it("first test", () => {});

          it("second test", () => {});
        });
      `,
      errors: [
        { messageId: "missingPaddingLine", data: { type: "test case" } },
        { messageId: "missingPaddingLine", data: { type: "test case" } },
      ],
    },
  ],
});
