import { runTest } from "../utils/run-test";
import rule, { RULE_NAME } from "./no-uncaught-mutate-async";

const valids = [
  // Already wrapped in try-catch
  `try {
    await user.mutateAsync(data)
  } catch (error) {
    console.error(error)
  }`,
  // Nested in try-catch
  `try {
    const result = await user.mutateAsync(data)
    await another.mutateAsync(result)
  } catch (error) {
    console.error(error)
  }`,
  // Not mutateAsync call
  `await user.mutate(data)`,
  `const result = someFunction()`,
];

const invalids = [
  "await user.mutateAsync(data)",
  `const result = await user.mutateAsync(data)
  if (result) {
    console.log(result)
  }`,
  "someFunction(await user.mutateAsync(data))",
];

runTest({
  name: RULE_NAME,
  rule,
  valid: valids,
  invalid: invalids.map((code) => ({
    code,
    errors: [{ messageId: "noUncaughtMutateAsync" }],
  })),
});
