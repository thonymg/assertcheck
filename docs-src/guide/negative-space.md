# Negative Space Programming

## The idea

In visual art, **negative space** is the empty area surrounding a subject — the sky around a bird, the background behind a figure. Paradoxically, it is often the negative space that defines the subject: without it, the form has no edge.

The same principle applies to code.

**Negative Space Programming (NSP)** is the practice of explicitly defining what your program *cannot accept* — the invalid states, violated invariants, and broken assumptions that must never occur. Instead of writing code that quietly absorbs bad input, you write code that loudly rejects it.

assertcheck is a direct implementation of this philosophy.

## Without NSP: silent propagation

```ts
function chargeOrder(order: Order) {
  if (!order) return
  if (!order.amount) return
  if (order.status !== "pending") return

  // process payment...
}
```

This function defends against bad input by silently returning. The caller that passed a `null` order or a wrong-status order never finds out. Every defensive `if` is a place where a broken assumption is absorbed rather than exposed. The bug is hidden, not caught — and it will surface somewhere else, later, with no trace back to its origin.

## With NSP: loud rejection

```ts
function chargeOrder(order: Order) {
  assert.notNil(order, "order is required")
  assert.positive(order.amount, {
    msg:  "order amount must be positive",
    note: "zero-amount orders should be filtered before this stage",
  })
  assert.equal(order.status, "pending", {
    msg:    "order must be pending before charge",
    actual: "order.status",
    note:   "call resetOrder() before retrying",
  })

  // process payment...
}
```

Now every invalid state has a name, a message, and a precise error location. When `chargeOrder` is called with bad data, the assertion fires immediately — not three layers later in the payment processor with a cryptic stack trace.

## The negative space of a function

Every function implicitly defines a set of **invariants** — conditions that must hold for the function to behave correctly. NSP makes those invariants explicit and executable:

- `assert.notNil(userId)` → "null user IDs must never reach this code"
- `assert.positive(price)` → "non-positive prices are invalid at this stage"
- `check(users).noNils().uniqueBy("id")` → "the users array must always be clean when passed here"

Assertions are **living contracts**. They tell the reader what the function expects, and they tell the debugger exactly where an expectation was violated. Unlike comments, they cannot go stale — if they are wrong, they fire.

## Fail-fast: errors at their origin

The most expensive bugs are the ones that fail far from their cause. A null value created in `parseConfig()` that first throws in `renderPage()` is diagnosed by working backwards through half the call stack.

NSP — and assertcheck's fail-fast default — inverts this. Assertions fire at the point of violation:

```ts
function parseConfig(raw: unknown) {
  assert.object(raw, "config must be an object")
  assert.hasKeys(raw as object, ["host", "port"], "missing required config keys")
  assert.positive((raw as any).port, "port must be a positive number")
  // ...
}
```

If `raw.port` is missing, the assertion fires in `parseConfig`, not in the TCP socket that tried to bind to `undefined`.

## Self-documenting constraints

An assertion is not a comment — it is **executable documentation**. Comments rot; assertions don't. A `// userId must not be null here` comment might be stale in six months. An `assert.notNil(userId)` that fires is never stale.

```ts
// Before: a comment that might lie
// Note: price must be greater than 0 at this point
function applyDiscount(price: number, pct: number) {
  return price * (1 - pct)
}

// After: a contract that cannot lie
function applyDiscount(price: number, pct: number) {
  assert.positive(price, "price must be positive before discount")
  assert.withinRange(pct, 0, 1, "discount must be a fraction between 0 and 1")
  return price * (1 - pct)
}
```

The second version communicates the same constraints as the comments, but verifies them at runtime and reports violations immediately.

## The `assert.not` API: naming the forbidden directly

assertcheck's `assert.not` is the most literal expression of NSP — it passes if and only if the wrapped assertion *would* throw:

```ts
assert.not(assert.equal, user.role, "admin")   // user must NOT be admin
assert.not(assert.includes, errors, "FATAL")   // errors must contain no FATAL entry
assert.not(assert.hasKey, patch, "id")         // id is immutable — patch must not include it
```

Naming what must not be true is often clearer than naming what must be true. The `assert.not` wrapper makes that inversion explicit and readable.

## Assertion density: the NASA guideline

The Power of Ten rules developed by NASA for safety-critical systems include: *"use a minimum of two runtime assertions per function."*

This is NSP applied systematically: not just checking the final output, but asserting invariants at the function boundary and at each significant step. assertcheck's chainable API makes this density natural without the verbosity:

```ts
function processPayment(payment: Payment, account: Account) {
  // Entry invariants — define the negative space at the boundary
  assert.notNil(payment, "payment is required")
  assert.notNil(account, "account is required")
  assert.positive(payment.amount, "payment amount must be positive")
  assert.equal(payment.currency, account.currency, {
    msg: "currency mismatch between payment and account",
    actual: "payment.currency",
  })

  const result = gateway.charge(payment)

  // Exit invariant — define what a valid result looks like
  assert.notNil(result.transactionId, "gateway must return a transaction ID")

  return result
}
```

Five assertions, one function, no silent failures.

## Mode strategy: enforcement vs. observability

NSP does not require assertions to crash in production. assertcheck's three modes let you choose the right enforcement level per environment:

| Mode | NSP posture |
|---|---|
| `"enabled"` | Full enforcement — violations crash immediately |
| `"warn"` | Observability — violations are logged, execution continues |
| `"disabled"` | Trust established — assertions are stripped, zero overhead |

A common production pattern — fail hard in development and CI, observe in production:

```ts
import { modeAssertIn } from "assertcheck"

modeAssertIn("prod", "warn")  // surface violations without crashing users
```

Your negative space constraints remain active in production: they log instead of throw, giving visibility into cases where invariants are violated without causing downtime. Over time, a clean assertion log is proof that your negative space is holding.

::: tip
Assertion density is a design signal. If you find yourself unable to write two meaningful assertions for a function, the function may be doing too little (merge it) or too much (split it).
:::

## Further reading

- [Assertion modes](/guide/modes) — how to configure enforcement per environment
- [Chainable API](/guide/check) — `check()` for dense, readable invariant blocks
- [Custom assertions](/guide/custom-assertions) — extend assertcheck with domain-specific contracts
