---
name: assertcheck-new
description: Design and write new TypeScript code (function, class, service, handler, module) with assertcheck, contract first. Use when the user is creating a new feature, writing a spec or the invariants of something not built yet, scaffolding a module, or asks which assert.* to use for an invariant.
---

# assertcheck-new

Negative Space Programming for code that does not exist yet: declare what must never happen, then write the logic.

## Workflow

### 1. Contract: ask only what is missing

Skip any question the user already answered.

1. Entry point? (function, route, method)
2. Inputs, and where each comes from? (user, HTTP body, DB, env var, another service)
3. What makes each input invalid? (null, empty, wrong type, out of range)
4. Prior state required? (e.g. the order must be pending)
5. External call: what must be true about the response?
6. What must the output guarantee? What must NEVER happen? (domain level: "never charge a cancelled order")

If the user only wants a spec, stop after step 2 and deliver the table.

### 2. Contract table: one invariant per row, each with its assertion

```
| #  | Boundary   | Must hold                       | Assert with                              |
|:---|:-----------|:--------------------------------|:-----------------------------------------|
| P1 | param      | customerId is a non-empty string | assert.notEmpty(customerId, …)          |
| P2 | param      | items is non-empty, qty > 0     | check(items).notEmpty().all(i => i.qty > 0) |
| P3 | prior state| order.status is "pending"       | assert.equal(order.status, "pending", …) |
| Q1 | output     | order.id is set                 | assert.notEmpty(order.id, …)             |
```

Preconditions are P, postconditions are Q. Pick each assertion with [references/selector.md](references/selector.md). Skip what the TypeScript type already guarantees.

### 3. Code: guards, then logic, then postconditions

```ts
import { assert, check } from "assertcheck"

function createOrder(customerId: string, items: CartItem[]): Order {
  assert.notEmpty(customerId, "customerId must not be empty")
  check(items)
    .notEmpty("cart must have at least one item")
    .all(i => i.quantity > 0, {
      msg:  "all items must have a positive quantity",
      note: "remove items with quantity <= 0 before calling createOrder()",
    })

  const order = { id: crypto.randomUUID(), customerId, items, status: "pending" as const }

  assert.notEmpty(order.id, "order must have a generated id")
  return order
}
```

Rules:
- **Never write a code comment** (`//`, `/* */`, JSDoc, section banners, `// P1` markers, `assertcheck-ignore`) unless the user explicitly asks for one. The assertion `msg` is the documentation; guards, logic and postconditions are separated by a blank line.
- The guard block is the first thing in the body. No logic before the last guard.
- No `?.`, `??` or `if (!x) return` in the logic block. A nil check there belongs in the guards.
- Every assertion has a `msg` that states the invariant (`"orderId must be a non-empty string"`, never `"value is null"`). Add `note` when the fix is non-obvious.
- Common blocks (HTTP handler, service with state guard, constructor, env bootstrap, external call): [references/guard-templates.md](references/guard-templates.md).

### 4. Deliver

Contract table, then the code, then one sentence per assertion saying which state it rejects. Check the list at the top: no row without an assertion, no logic before the guards.

When the project already has code to harden, use `assertcheck-existing` instead.
