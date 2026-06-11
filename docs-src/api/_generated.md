**assertcheck v0.2.152**

***

# assertcheck v0.2.152

## Remarks

**`"enabled"` is the unconditional default — including in production.**
You never need to configure anything to start using assertions.
Only call [modeAssertIn](functions/modeAssertIn.md) when you explicitly want to change the
behaviour for a specific environment.

**Entry points:**

```ts
// 1. Standalone assertion functions — most common
import { assert } from "assertcheck"

// 2. Chainable wrapper
import { check } from "assertcheck"

// 3. Environment-conditional mode override — call once at app boot
import { modeAssertIn } from "assertcheck"
```

**Mode overview:**

| Mode         | Behaviour           | Default?       |
|--------------|---------------------|----------------|
| `"enabled"`  | Log + throw         | ✅ Always      |
| `"warn"`     | Log only, no throw  | Via modeAssertIn |
| `"disabled"` | No-op, zero cost    | Via modeAssertIn |

## Example

```ts
// app.ts — one call at the entry point, everything else just works
import { modeAssertIn, assert, check } from "assertcheck"

modeAssertIn("prod", "warn") // soft landing in production

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

## Type Aliases

- [AssertMode](type-aliases/AssertMode.md)
- [Env](type-aliases/Env.md)

## Functions

- [buildBlock](functions/buildBlock.md)
- [check](functions/check.md)
- [fmtValue](functions/fmtValue.md)
- [getAssertMode](functions/getAssertMode.md)
- [modeAssertIn](functions/modeAssertIn.md)
- [setAssertMode](functions/setAssertMode.md)
