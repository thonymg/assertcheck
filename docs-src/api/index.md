# API Reference

Complete API reference for `assertcheck`, auto-generated from JSDoc in the source code.

::: tip Each assertion is on its own page
Click on [`assert` namespace](/api/@assertcheck/namespaces/assert/_generated) to browse all ~50 methods, each with full signature, parameters table, and examples.
:::

## Core

| Export | Description |
|---|---|
| [`assert`](/api/@assertcheck/namespaces/assert/_generated) | The main assertion namespace — all ~50 methods documented individually. |
| [`check()`](/api/functions/check) | Chainable wrapper — `check(arr).noNils().uniqueBy("id")` |
| [`modeAssertIn()`](/api/functions/modeAssertIn) | Set mode conditionally based on `NODE_ENV` |
| [`setAssertMode()`](/api/functions/setAssertMode) | Set mode directly |
| [`getAssertMode()`](/api/functions/getAssertMode) | Read current mode |

## Classes

| Class | Description |
|---|---|
| [`Checker`](/api/classes/Checker) | Base class for chainable checkers |
| [`ArrayChecker`](/api/classes/ArrayChecker) | Returned by `check()` when the value is an array |
| [`ObjectChecker`](/api/classes/ObjectChecker) | Returned by `check()` when the value is an object |
| [`AssertionError`](/api/classes/AssertionError) | Error thrown on assertion failure |

## Formatting primitives

| Export | Description |
|---|---|
| [`buildBlock()`](/api/functions/buildBlock) | Build a formatted error block string |
| [`fmtValue()`](/api/functions/fmtValue) | Format any value for display |

## Types

| Type | Description |
|---|---|
| [`AssertOptions`](/api/interfaces/AssertOptions) | Options accepted by every assertion (`msg`, `note`, `actual`) |
| [`AssertMode`](/api/type-aliases/AssertMode) | `"enabled"` \| `"warn"` \| `"disabled"` |
| [`Env`](/api/type-aliases/Env) | Environment label for `modeAssertIn()` |

---

> This reference is generated from the JSDoc comments in the source. To regenerate after editing the source, run `bun run docs:api`.
