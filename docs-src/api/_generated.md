**assertcheck v0.5.15**

***

# assertcheck v0.5.15

## Remarks

Assertions are **always enabled** — failures always output and throw.
There is no mode system.

**Entry points:**

```ts
// 1. Standalone assertion functions — most common
import { assert } from "assertcheck"

// 2. Chainable wrapper
import { check } from "assertcheck"
```

## Example

```ts
import { assert, check } from "assertcheck"

assert.equal(order.status, "pending", {
  msg:    "order must be pending before payment",
  actual: "order.status",
  note:   "call resetOrder() first",
})

check(users)
  .noNils()
  .uniqueBy("id", "duplicate user IDs")
  .all(u => u.active, "all users must be active")
```

## Namespaces

- [assert](assertcheck/namespaces/assert/_generated.md)

## Classes

- [ArrayChecker](classes/ArrayChecker.md)
- [AssertionError](classes/AssertionError.md)
- [Checker](classes/Checker.md)
- [ObjectChecker](classes/ObjectChecker.md)

## Interfaces

- [AssertionErrorOptions](interfaces/AssertionErrorOptions.md)
- [AssertOptions](interfaces/AssertOptions.md)

## Functions

- [buildBlock](functions/buildBlock.md)
- [check](functions/check.md)
- [fmtValue](functions/fmtValue.md)
